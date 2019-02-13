const LSMQueue = artifacts.require("../contracts/LSMQueue.sol");
let lsmQueue;

contract("LSMQueue", (accounts) => {
  it("1. should be deployable", () => {
    return LSMQueue.new().then(instance => {
      console.log("       The contract is deployed at", instance.address);
      lsmQueue = instance;
    });
  });

  it("2. should be able get queue depth", () => {
    console.log("       at the start, the queue is empty");
    return lsmQueue.getDepth()
      .then(result => assert.equal(result, 0));
  });

  it("3. should be able to enqueue", () => {
    return lsmQueue.push(accounts[1], accounts[2], 20)
      .then(() => {
        console.log("       transfer 20 tokens from A to B ");
        return lsmQueue.getDepth();
      }).then(result => {
        console.log("       after enqueue, the queue depth is", result.toNumber());
        assert.equal(result, 1);
      }) 
  });

  it("4. should return a get details by id", () => {
    return lsmQueue.getIdByIdx(0)
      .then(result => {
        console.log("       the transaction Id is", result);
        return lsmQueue.getTxnTokenById(result);
      }).then(result => {
        console.log("       ... and amount is", result.toNumber());
        assert.equal(result, 20);
      }); 
  })

  it ("5. should be able to remove txn from queue", () => {
    return lsmQueue.getIdByIdx(0)
      .then(result => {
        console.log("       remove txn", result, "from the queue");
        return lsmQueue.pull(result);
      }).then(()=>{
        return lsmQueue.getDepth();
      }).then(result =>{
        console.log("       now the queue depth is", result.toNumber());
        assert.equal(result, 0);
      })
  })


});