import express, { Request, Response, NextFunction } from "express";
import Web3 from "web3";
import dotenv from "dotenv";
import * as admin from "firebase-admin";

// face stuff
import * as faceapi from "face-api.js";
import * as canvas from "canvas";
import "@tensorflow/tfjs-node";
// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement, additionally an implementation
// of ImageData is required, in case you want to use the MTCNN
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData } as any);

// express init
const app = express();
const port = 3001;
// middle wares
app.use(express.json());

// firebase init
dotenv.config();
const fServiceAcc = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACC, "base64").toString()
);
const fireApp = admin.initializeApp({
  credential: admin.credential.cert(fServiceAcc),
});
const db = fireApp.firestore();
// face rec init
// face descriptors array helpers
const faceColRef = db.collection("faces");
function getArrayFromF32ArrayArray(faceData: Float32Array[]) {
  // return faceData.map(arr => Array.from(arr));
  return faceData.map((arr) =>
    Buffer.from(String.fromCharCode(...new Uint8Array(arr.buffer))).toString(
      "base64"
    )
  );
}
function getF32ArrayArrayFromArrayArray(rawFaceData: number[][]) {
  return rawFaceData.map((arr) => Float32Array.from(arr));
}
function getF32ArrayArrayFromStringArray(rawFaceData: string[]) {
  return rawFaceData.map(
    (arr) =>
      new Float32Array(
        new Uint8Array(
          [...Buffer.from(arr, "base64").toString()].map((c) => c.charCodeAt(0))
        ).buffer
      )
  );
}
const faceDescriptors: Record<string, faceapi.LabeledFaceDescriptors> = {};
faceColRef.onSnapshot((colSnapshot) => {
  colSnapshot.docChanges().forEach((change) => {
    if (change.type === "added") {
      const data = change.doc.data();
      console.log("New face: ", change.doc.id);
      faceDescriptors[change.doc.id] = new faceapi.LabeledFaceDescriptors(
        data.label,
        getF32ArrayArrayFromStringArray(data.descriptors)
      );
      // console.log("New face: ", faceDescriptors[change.doc.id]);
      // console.log(Object.values(faceDescriptors));
    }
    if (change.type === "modified") {
      const data = change.doc.data();
      console.log("Modified face: ", change.doc.id);
      faceDescriptors[change.doc.id] = new faceapi.LabeledFaceDescriptors(
        data.label,
        getF32ArrayArrayFromStringArray(data.descriptors)
      );
    }
    if (change.type === "removed") {
      console.log("Removed face: ", change.doc.id);
      delete faceDescriptors[change.doc.id];
    }
  });
});

// web3 init
const web3 = new Web3("http://localhost:8545");
const privateKey = process.env.PRIVATE_KEY;
const jsonInterface = JSON.parse(
  Buffer.from(process.env.CONTRACT_JSON_ABI, "base64").toString()
);
// console.log(jsonInterface);
// console.log(JSON.stringify(jsonInterface, null, 4));
const contractAddress = process.env.CONTRACT_ADDRESS;
const account = web3.eth.accounts.privateKeyToAccount("0x" + privateKey);
const contract = new web3.eth.Contract(jsonInterface, contractAddress, {
  gasPrice: "0",
  from: account.address,
});

// types!
interface AddCustomer {
  customerId: string;
  name: string;
  passportNumber: string;
  faceData: Float32Array[];
}

// routes
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Welcome to Orange Identity API");
});

app.post(
  "/api/customer/add",
  async (req: Request, res: Response, next: NextFunction) => {
    const rawBody = req.body;
    rawBody.faceData = getF32ArrayArrayFromArrayArray(rawBody.faceData);
    const body = rawBody as AddCustomer;
    console.log("Got customer add", body);

    // res.send(Array.from(body.faceData.map(arr => Array.from(arr))));
    // return;

    const docRef = db.collection("users").doc(body.customerId);
    const doc = await docRef.get();
    if (!doc.exists) {
      await docRef.set({
        name: body.name,
        passportNumber: body.passportNumber,
      });
    } else {
      await docRef.update({
        name: body.name,
        passportNumber: body.passportNumber,
      });
    }

    await db
      .collection("faces")
      .doc(body.customerId)
      .set({
        label: body.customerId,
        descriptors: getArrayFromF32ArrayArray(body.faceData),
      });

    const tx = contract.methods.addCustomer(
      body.customerId,
      body.name,
      body.passportNumber,
      JSON.stringify(getArrayFromF32ArrayArray(body.faceData))
    );

    const newTx = {
      from: account.address,
      to: contractAddress,
      gas: "0x100000",
      data: tx.encodeABI(),
    };

    // console.log("Transaction: ", newTx);
    const signedTx = await account.signTransaction(newTx);
    // console.log("signed transaction: ", signedTx.rawTransaction);
    const result = web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    // result
    //   .on("receipt", function (receipt) {
    //     console.log("Receipt:", receipt);
    //   })
    //   .on("error", (err) => {
    //     console.log("Error calling method", err);
    //   });

    let ret = {};
    try {
      const receipt = await result;
      console.log("Receipt 2", receipt);
      ret = {
        msg: "Added customer successfully",
      };
    } catch (err) {
      console.log("Error calling method", err);
      ret = {
        msg: "Error adding customer",
        error: err,
      };
    }

    res.send(ret);
  }
);

app.post(
  "/api/airport/matchFace",
  async (req: Request, res: Response, next: NextFunction) => {
    const rawBody = req.body;
    const faceData = getF32ArrayArrayFromArrayArray(rawBody.faceData);

    console.log("Got face match request");

    console.log("face descriptors", faceDescriptors.values);
    const faceMatcher = new faceapi.FaceMatcher(Object.values(faceDescriptors));

    const bestMatch = faceMatcher.findBestMatch(faceData[0]);

    console.log("Got match", bestMatch.toString());

    res.send({
      "match": {
        "label": bestMatch.label,
        "distance": bestMatch.distance
      }
    })
  }
);

// listen
app.listen(port, () => {
  console.log(`Orange Identity API is running on port ${port}.`);
});
