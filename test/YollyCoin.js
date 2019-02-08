const YollyCoin = artifacts.require("../contracts/YollyCoin.sol");

contract("YollyCoin", (accounts) => {
    it("should be able to send direct settlement", () => {
        return YollyCoin.deployed().then( instance => {
            instance.transfer(accounts[1], 10)
                .then( result => {
                    assert.equal(result, true);
                })
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
});