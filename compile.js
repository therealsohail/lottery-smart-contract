const path = require("path");
const fs = require("fs");
const solc = require("solc");

const contractPath = path.resolve(__dirname, "contracts", "_Lottery.sol");
const sourceCode = fs.readFileSync(contractPath, "utf-8");

let input = JSON.stringify({
  language: "Solidity",
  sources: {
    "_Lottery.sol": {
      content: sourceCode,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
});

let output = JSON.parse(solc.compile(input));
let bytecode = output.contracts["_Lottery.sol"].Lottery.evm["bytecode"].object;
let abi = output.contracts["_Lottery.sol"].Lottery.abi;

module.exports = { bytecode, abi };
