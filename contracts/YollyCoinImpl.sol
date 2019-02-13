pragma solidity >=0.4.21 <0.6.0;

import "./LSMQueue.sol";

contract YollyCoinImpl {

  LSMQueue private lsmQueue;
  YollyCoin private yollyCoin;
  uint maxDepth = 5;

  event Enqueue (address from, address to, uint value);

  constructor(address _lsmQueue, address payable _yollyCoin) public {
    lsmQueue = LSMQueue(_lsmQueue);
    yollyCoin = YollyCoin(_yollyCoin);
  }

  function balanceOf(address tokenOwner) public view returns (uint balance) {
    return yollyCoin.balanceOf(tokenOwner);
  }

  function transfer(address to, uint tokens) public returns (bool success) {
    return yollyCoin.transfer(to, tokens);
  }

  function transferFrom(address from, address to, uint tokens) public returns (bool) {
    if (yollyCoin.balanceOf(from) >= tokens) {
      yollyCoin.transferFrom(from, to, tokens);
    } else {
      lsmQueue.push(from, to, tokens);      
      emit Enqueue(from, to, tokens);
    }
    if ( lsmQueue.getDepth() >= maxDepth) {
      lsmQueue.runNetting();
      release();
    }
  }
  // ------------------------------------------------------------------------
  // release 
  // ------------------------------------------------------------------------
  function release() public {
    address _from;
    address _to;
    uint _tokens;
    for (uint i=0; i<lsmQueue.getDepth(); i++) {
      bytes32 _id = lsmQueue.getIdByIdx(i);
      (_from, _to, _tokens) = lsmQueue.getTxnDetailById(_id);
      if (yollyCoin.balanceOf(_from) >= _tokens) {
        yollyCoin.transferFrom(_from, _to, _tokens);
        lsmQueue.pull(_id);
      }
    }
  }

  // ------------------------------------------------------------------------
  // view
  // ------------------------------------------------------------------------
  function getDepth() public view returns (uint) {
    return lsmQueue.getDepth();
  }
}

