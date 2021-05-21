const AWS = require("aws-sdk");
const path = require("path");
const fs = require("fs");

const ignoreFiles = ["common"];
const mappedFiles = { "package.json": "deploy" };

const lambda = new AWS.Lambda({
  apiVersion: "2015-03-31",
  region: "us-east-1",
});

const changedFiles = [
  "deploy",
  "launch",
  "shutdown",
  "origin-request",
  "complete",
  "update",
  "describe",
];

console.log("Files that were changed", changedFiles);
const out = path.join(__dirname, "..", "out");

Promise.all(
  changedFiles.map((id) =>
    lambda
      .updateFunctionCode({
        FunctionName: `RoamJS_${id}`,
        Publish: true,
        ZipFile: fs.readFileSync(path.join(out, `${id}.zip`)),
      })
      .promise()
  )
)
  .then((r) => console.log("Successfully deployed", r.length, "functions!"))
  .catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
