const YollyCoin = artifacts.require("YollyCoin");
const LSMQueue = artifacts.require("LSMQueue");

module.exports = function(deployer) {
    let txnQueue;
    deployer.deploy(LSMQueue).then(instance => {
        lsmQueue = instance.address;
        return deployer.deploy(YollyCoin, lsmQueue)
    });
};