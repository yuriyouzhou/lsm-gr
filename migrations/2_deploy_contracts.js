const YollyCoin = artifacts.require("YollyCoin");
const TxnQueue = artifacts.require("TxnQueue");

module.exports = function(deployer) {
    let txnQueue;
    deployer.deploy(TxnQueue).then(instance => {
        txnQueue = instance.address;
        return deployer.deploy(YollyCoin, txnQueue)
    });
};