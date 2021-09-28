import express, { Request, Response, NextFunction } from "express";
import Web3 from "web3";
import { TransactionConfig } from "web3-core";
import dotenv from "dotenv";

// express init
const app = express();
const port = 3001;
// middle wares
app.use(express.json());

// web3 init
dotenv.config();
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
    rawBody.faceData = rawBody.faceData.map((arr: number[]) =>
      Float32Array.from(arr)
    );
    const body = rawBody as AddCustomer;
    console.log("Got customer add", body);

    const tx = contract.methods
      .addCustomer(
        body.customerId,
        body.name,
        body.passportNumber,
        JSON.stringify(body.faceData)
      )

    const newTx = {
      from: account.address,
      to: contractAddress,
      gas: "0x100000",
      data: tx.encodeABI()
    }

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
        "msg": "Added customer successfully"
      }
    } catch (err) {
      console.log("Error calling method", err);
      ret = {
        "msg": "Error adding customer",
        "error": err
      }
    }

    res.send(ret);
  }
);

// listen
app.listen(port, () => {
  console.log(`Orange Identity API is running on port ${port}.`);
});
