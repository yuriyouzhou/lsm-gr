const YollyCoinImpl = artifacts.require("../contracts/YollyCoinImpl.sol");
const LSMQueue = artifacts.require("../contracts/LSMQueue.sol");
const YollyCoin = artifacts.require("../contracts/YollyCoin.sol");

let yollyCoinImpl;
let lsmQueue;
let yollyCoin;

contract("YollyCoinImpl", (accounts) => {
    it("should deploy", () => {
        return YollyCoin.new().then(instance => {
            yollyCoin = instance;
            console.log("       yollyCoin deployed at", yollyCoin.address);
            return LSMQueue.new();
        }).then(instance => {
            lsmQueue = instance;
            console.log("       lsmQueue deployed at", lsmQueue.address);
            return YollyCoinImpl.new(lsmQueue.address, yollyCoin.address);
        }).then(instance => {
            yollyCoinImpl = instance;
            console.log("       yollyCoinImpl deployed at", yollyCoinImpl.address)
        });
    })


    it("should be able to directly settle if balance is sufficient", () => {
        return yollyCoinImpl.transferFrom(accounts[0], accounts[1], 10)
            .then( () => {
                console.log("       issuing 10 tokens to A...");
                return yollyCoinImpl.balanceOf(accounts[1]);
            }).then(result => {
                assert.equal(result, 10);
                console.log("       sending 5 tokens from A to B...");
                return yollyCoinImpl.transferFrom(accounts[1], accounts[2], 5);
            }).then(result => {
                return yollyCoinImpl.balanceOf(accounts[1]);
            }).then(result => {
                console.log("       Balance of A is", result.toNumber());
                assert.equal(result, 5);
                return yollyCoinImpl.balanceOf(accounts[2]);
            }).then(result => {
                console.log("       Balance of b is", result.toNumber());
                assert.equal(result, 5);
            });
    });


    it("should put txn into queue if balance is insufficient", () => {
        return yollyCoinImpl.transferFrom(accounts[2], accounts[3], 10)
            .then(() => {
                console.log("       sending 10 tokens from B to C...");
                return lsmQueue.getDepth();
            }).then(result => {
                console.log("       transaction enqueued..");
                return yollyCoinImpl.balanceOf(accounts[2]);
            }).then(result => {
                console.log("       Balance of B is", result.toNumber());
                assert.equal(result, 5);
                return yollyCoinImpl.getDepth();
            }).then(result => {
                console.log("       Current Queue Depth is", result.toNumber());
                assert.equal(result, 1);
            });
    });    

    it("should be able to update priority", () => {
        return yollyCoinImpl.transferFrom(accounts[3], accounts[2], 15)
            .then(() => {
                console.log("       sending 10 tokens from C to B...");
                return lsmQueue.getDepth();
            }).then(result => {
                console.log("       transaction enqueued...");
                console.log("       Current Queue Depth is", result.toNumber());
                return lsmQueue.getIdByIdx(1);
            }).then(result => {
                console.log("       make this txn high priority...");
                return lsmQueue.updatePriority(result, 0);
            }).then(result => {
                return lsmQueue.getIdByIdx(0);
            }).then(result => {
                return lsmQueue.getTxnDetailById(result);
            }).then(result => {
                console.log("       this txn has been moved to front...");
                assert.equal(result[0], accounts[2]);
            });
    });   

    it("should perform netting", () => {
        return lsmQueue.runNetting()
            .then(() => {
                console.log("       trigger netting..");
                return lsmQueue.getDepth();
            }).then(result => {
                console.log("       Current Queue Depth is", result.toNumber());
                return lsmQueue.getIdByIdx(0);
            }).then(result => {
                return lsmQueue.getTxnDetailById(result);
            }).then(result => {
                console.log("       this txn is from C to B", result[2].toNumber(), "tokens");
                assert.equal(result[2], 5);
            });
    });   

    it("should release the queue", () => {
        return yollyCoinImpl.transferFrom(accounts[0], accounts[3], 10)
            .then(() => {
                console.log("       issuing 5 tokens to c..");
                return yollyCoinImpl.release();
            }).then(() => {
                return lsmQueue.getDepth();
            }).then(result => {
                console.log("       Current Queue Depth is", result.toNumber());
                assert.equal(result, 0);
                return yollyCoinImpl.balanceOf(accounts[2]);
            }).then(result => {
                console.log("       B has balance of", result.toNumber());
                assert.equal(result, 10);
            });
    });  
});