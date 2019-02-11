const LSMQueue = artifacts.require("../contracts/LSMQueue.sol");
let lsmQueue;

contract("LSMQueue", (accounts) => {
  it("should be deployable", () => {
    return LSMQueue.new().then(instance => {
      lsmQueue = instance;
    });
  });

  it("should be able get queue depth", () => {
    return lsmQueue.getDepth()
      .then(result => assert.equal(result, 0));
  });

  it("should be able to enqueue", () => {
   return lsmQueue.push(accounts[1], accounts[2], 20)
      .then(() => {
        return lsmQueue.getDepth();
      }).then(result => {
        assert.equal(result, 1);
      }) 
  });

  it("should return a get details by id", () => {
    return lsmQueue.getIdByIdx(0)
      .then(result => {
        return lsmQueue.getTxnTokenById(result);
      }).then(result => {
        assert.equal(result, 20);
      }); 
  })

  it ("should be able to remove txn from queue", () => {
    return lsmQueue.getIdByIdx(0)
      .then(result => {
        return lsmQueue.pull(result);
      }).then(()=>{
        return lsmQueue.getDepth();
      }).then(result =>{
        assert.equal(result, 0);
      })
  })


});