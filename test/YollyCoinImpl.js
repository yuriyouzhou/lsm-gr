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
            console.log("yollyCoin: +" + yollyCoin.address);
            return LSMQueue.new();
        }).then(instance => {
            lsmQueue = instance;
            console.log("lsmQueue: +" + lsmQueue.address);
            return YollyCoinImpl.new(lsmQueue.address, yollyCoin.address);
        }).then(instance => {
            yollyCoinImpl = instance;
            console.log("yollyCoin: +" + yollyCoinImpl.address)
        });
    })

    it("should be able to view balance", () => {
        return yollyCoinImpl.balanceOf(accounts[1])
            .then( result => {
                assert.equal(result, 0);
            });
    })

    it("should be able to directly settle if balance is sufficient", () => {
        return yollyCoinImpl.transferFrom(accounts[0], accounts[1], 10)
            .then( () => {
                return yollyCoinImpl.balanceOf(accounts[1]);
            }).then(result => {
                assert.equal(result, 10);
            })
    });


    it("should put txn into queue if balance is insufficient", () => {
        return yollyCoinImpl.transferFrom(accounts[2], accounts[3], 10)
            .then(() => {
                return lsmQueue.getDepth();
            }).then(result => {
                assert.equal(result, 1);
            });
    });    

});