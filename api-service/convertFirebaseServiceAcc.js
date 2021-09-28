fs = require("fs");
console.log(Buffer.from((JSON.stringify(JSON.parse(fs.readFileSync("./firebase-service-account.json").toString())))).toString('base64'));
