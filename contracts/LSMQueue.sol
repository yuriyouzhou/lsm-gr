pragma solidity >=0.4.21 <0.6.0;

import "./YollyCoin.sol";

contract LSMQueue {

  mapping (bytes32=>Transaction) id2Txn;
  bytes32[] txnIdList;
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
    uint seq;
    mapping(address => Status) status;
  }

  // ------------------------------------------------------------------------
  // Transaction Queue method
  // ------------------------------------------------------------------------

  function push(address _from, address _to, uint _tokens) 
  public
  returns (bytes32)
  {
    bytes32 txnId = bytes32(sha256(abi.encodePacked(_from, _to, _tokens)));
    uint seq = txnIdList.length;
    txnIdList.push(txnId);
    id2Txn[txnId] = Transaction(_from, _to, _tokens, seq);
    return txnId;
  }

  function pull(bytes32 id)
  public
  returns (bool)
  {
    delete id2Txn[id];
    removeTxnIdFromList(id);
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
    return txnIdList.length;
  }  

  function getIdByIdx(uint idx) 
  public
  view
  returns (bytes32)
  {    
    bytes32 id = txnIdList[idx];  
    return id;
  }
  
  function getTxnTokenById(bytes32 id)
  public
  view
  returns (uint)
  {
    return id2Txn[id].tokens;
  }

  // ------------------------------------------------------------------------
  // Utility function
  // ------------------------------------------------------------------------
  function removeTxnIdFromList(bytes32 id)
  private
  {
    uint index = id2Txn[id].seq;
    for (uint i = index; i<txnIdList.length-1; i++) {
      txnIdList[i] = txnIdList[i+1];
    }
    delete txnIdList[txnIdList.length-1];
    txnIdList.length--;
  }
}

