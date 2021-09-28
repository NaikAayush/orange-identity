fs = require("fs");
console.log(Buffer.from((JSON.stringify(JSON.parse(fs.readFileSync("build/contracts/Orange.json").toString()).abi))).toString('base64'));