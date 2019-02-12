const YollyCoin = artifacts.require("../contracts/YollyCoin.sol");
const LSMQueue = artifacts.require("../contracts/LSMQueue.sol");

contract("YollyCoin", (accounts) => {
    
    it("should be able to view balance", () => {
        return YollyCoin.deployed().then(instance => {
            instance.balanceOf(accounts[2])
                .then( result => {
                    assert.equal(result, 0);
                })
        });
    })

    it("should be able to directly settle if balance is sufficient", () => {
        return YollyCoin.deployed().then( instance => {
            instance.transfer(accounts[1], 10)
                .then( result => {
                    assert.equal(result, true);
                    return instance.balanceOf(accounts[1]);
                }).then(result => {
                    assert.equal(result, 10);
                }).then(()=> {
                    return instance.transferFrom(accounts[1], accounts[3], 5);
                }).then(result => {
                    assert.equal(result, true);
                });
        });
    });

    it("should be able to enqueue using lsm", () => {
        return YollyCoin.deployed().then(instance => {
            instance.enqueue(accounts[1], 20)
                .then(result => {
                    assert.equal(result, true);
                })
        });
    });    

    it("should put txn into queue if balance is insufficient", () => {
        return YollyCoin.deployed().then(instance => {
            instance.balanceOf(accounts[1])
                .then(result => {
                    assert.equal(result, 5);
                }).then(() => {
                    return instance.transferFrom(accounts[1], accounts[2], 10);
                }).then(result => {
                    assert.equal(result, false);
                    LSMQueue.deployed().then(instance => {
                        return instance.getDepth();
                    }).then(result => {
                        assert.equal(result, 1);
                    });
                });
        });
    });    
});