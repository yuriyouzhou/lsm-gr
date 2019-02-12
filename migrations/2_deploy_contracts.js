const YollyCoin = artifacts.require("YollyCoin");
const LSMQueue = artifacts.require("LSMQueue");
const YollyCoinImpl = artifacts.require("YollyCoinImpl");

module.exports = function(deployer) {
    let _yollyCoin;
    let _lsmQueue;
    deployer
        .deploy(YollyCoin)
        .then(instance => {
            _yollyCoin = instance.address;
            return deployer.deploy(LSMQueue);
        }).then(instance => {
            _lsmQueue = instance.address;
            deployer.deploy(_yollyCoin, _lsmQueue);
        });

};