pragma solidity >=0.4.21 <0.6.0;

import "./YollyCoin.sol";

contract TxnQueue {
  enum Status {
    NULL, PENDING, COMPLETED, FAILED, CANCELLED
  }

  struct Transaction {
    address from;
    address to;
    uint tokens;
    mapping(address => Status) status;
  }

  mapping (bytes32=>Transaction) txnQueue;

  constructor() public {
    
  }

  function push(address from, address to, uint tokens) 
  public
  returns (bool success)
  {
    bytes32 id = keccak256(abi.encodePacked(from, to, tokens));
    txnQueue[id] = Transaction(from, to, tokens);
    return true;
  }

}

