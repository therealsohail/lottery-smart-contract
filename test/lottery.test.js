const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const { abi, bytecode } = require("../compile");

let web3 = new Web3(ganache.provider());
let accounts;
let lotteryContract;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  lotteryContract = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode })
    .send({
      from: accounts[0],
      gas: "1000000",
    });
});

describe("Lottery", () => {
  it("checks accounts", () => {
    assert.ok(accounts);
  });
  it("deploy contract", () => {
    assert.ok(lotteryContract.options.address);
  });
  it("checks manager", async () => {
    let manager = await lotteryContract.methods.manager().call();
  });
  it("enters 1 player in lottery", async () => {
    let enterPlayer = await lotteryContract.methods.enterLottery().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether"),
    });
    let players = await lotteryContract.methods.allPlayers().call();

    assert.strictEqual(1, players.length);
    assert.strictEqual(accounts[0], players[0]);
  });
  it("throws error when we dont pay entry fee", async () => {
    try {
      let enterPlayer = await lotteryContract.methods.enterLottery().send({
        from: accounts[0],
        value: 0,
      });

      assert(false);
    } catch (error) {
      assert(error);
    }
  });
  it("only manager can pick winners", async () => {
    try {
      await lotteryContract.methods.pickWinner().send({
        from: accounts[1],
      });
      assert(false);
    } catch (error) {
      assert(true);
    }
  });
});
