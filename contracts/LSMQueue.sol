pragma solidity >=0.4.21 <0.6.0;

import "./YollyCoin.sol";

contract LSMQueue {

  mapping (uint=>Transaction) ref2Txn;
  uint depth;

  constructor() public {

  }

  // ------------------------------------------------------------------------
  // Transaction facility
  // ------------------------------------------------------------------------
  enum Status {
    NULL, PENDING, COMPLETED, FAILED, CANCELLED
  }

  struct Transaction {
    address from;
    address to;
    uint tokens;
    mapping(address => Status) status;
  }

  // ------------------------------------------------------------------------
  // Transaction Queue method
  // ------------------------------------------------------------------------

  function push(address _from, address _to, uint _tokens) 
  public
  returns (uint)
  {
    // bytes32 txnId = bytes32(sha256(abi.encodePacked(_from, _to, _tokens)));
    depth ++;
    ref2Txn[depth] = Transaction(_from, _to, _tokens);
    return depth;
  }

  function pull(uint id)
  public
  returns (bool)
  {
    delete ref2Txn[id];
    depth --;
    return true;
  }

  // ------------------------------------------------------------------------
  // View function
  // ------------------------------------------------------------------------
  function getDepth() 
  public
  view
  returns (uint)
  {
    return depth;
  }  
}

