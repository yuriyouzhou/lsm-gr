const YollyCoin = artifacts.require("../contracts/YollyCoin.sol");

contract("YollyCoin", (accounts) => {
    it("should be able to send transfer", () => {

        return YollyCoin.deployed().then( instance => {
            instance.transfer(accounts[1], 10)
                .then( result => {
                    assert.equal(result, true);
                })
        }) ;
        


            

    });
});