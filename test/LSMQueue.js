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
   lsmQueue.push(accounts[1], accounts[2], 20)
      .then(result => {
        return lsmQueue.getDepth();
      }).then(result => {
        assert.equal(result, 1);
      }) 
  });

  it("should return a ref number after enqueue", () => {
    return lsmQueue.pull(1)
    .then(()=> {
      return lsmQueue.getDepth();
    }).then((result)=> {
      assert.equal(result, 0);
    })

  })


});