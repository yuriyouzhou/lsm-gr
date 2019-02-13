pragma solidity >=0.4.21 <0.6.0;

import "./YollyCoin.sol";

contract LSMQueue {

  mapping (bytes32=>Transaction) id2Txn;
  bytes32[] txnIdList;
  uint depth;
  uint highPriorityCount = 0;

  constructor() public {

  }

  // ------------------------------------------------------------------------
  // Transaction facility
  // ------------------------------------------------------------------------
  enum Status {
    NULL, PENDING, COMPLETED, FAILED, CANCELLED
  }

  enum Priority {
    LOW, HIGH
  }

  struct Transaction {
    address from;
    address to;
    uint tokens;
    uint timestamp;
    Priority priority;
    mapping(address => Status) status;
  }

  // ------------------------------------------------------------------------
  // Queue Data Structure method
  // ------------------------------------------------------------------------

  function push(address _from, address _to, uint _tokens) 
  public
  returns (bytes32)
  {
    bytes32 txnId = bytes32(sha256(abi.encodePacked(_from, _to, _tokens)));
    txnIdList.push(txnId);
    id2Txn[txnId] = Transaction(_from, _to, _tokens, now, Priority.LOW);
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
  // Netting method
  // ------------------------------------------------------------------------
  function updatePriority(bytes32 _id, Priority _priority) public {
    require(id2Txn[_id].priority != _priority, "no update needed"); 

    //update priority
    id2Txn[_id].priority = _priority;
    //sort queue by priority and joining order
    updateQueue(_id);    
  }
  // ------------------------------------------------------------------------
  // Netting method
  // ------------------------------------------------------------------------
  function runNetting() 
  public
  {
    while(_bilateralNetting()) {}
  }

  function _bilateralNetting() 
  private
  returns (bool)
  {
    for (uint i = 0; i<txnIdList.length; i++) {
      bytes32 _id1 = txnIdList[i];
      for (uint j = 1; j<txnIdList.length; j++) {
        bytes32 _id2 = txnIdList[j];
        if (id2Txn[_id1].from == id2Txn[_id2].to && 
          id2Txn[_id1].to == id2Txn[_id2].from) {
            // for all bilateral pairs
          if(id2Txn[_id1].tokens > id2Txn[_id2].tokens) {
            id2Txn[_id1].tokens = id2Txn[_id1].tokens - id2Txn[_id2].tokens;
            return pull(_id2);
          } else {
            id2Txn[_id2].tokens = id2Txn[_id2].tokens - id2Txn[_id1].tokens;
            return pull(_id1);
          }
        }
      } 
    }
    return false;
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

  function getTxnDetailById(bytes32 _id)
  public
  view
  returns (address, address, uint)
  {
    return (id2Txn[_id].from, id2Txn[_id].to, id2Txn[_id].tokens);
  }

  // ------------------------------------------------------------------------
  // Utility function
  // ------------------------------------------------------------------------
  function removeTxnIdFromList(bytes32 _id)
  private
  {
    uint index = arrayIndexOf(_id);
    for (uint i = index; i<txnIdList.length-1; i++) {
      txnIdList[i] = txnIdList[i+1];
    }
    delete txnIdList[txnIdList.length-1];
    txnIdList.length--;
  }

  function updateQueue(bytes32 _id) 
  private
  {
    uint _timestamp = id2Txn[_id].timestamp;
    uint i;
    bytes32 currId;
    uint currTime;
    Priority currPriority;
    Priority _priority = id2Txn[_id].priority;
    uint _idx = arrayIndexOf(_id);
    uint j = _idx;

    if (_priority == Priority.LOW) { //shift to the right
      highPriorityCount --;
      if (_idx == txnIdList.length - 1) return ;
      for (i = _idx+1; i<=txnIdList.length-1;i++) {
        currId = txnIdList[i];
        currPriority = id2Txn[currId].priority;
        currTime = id2Txn[currId].timestamp;
        if (currPriority == Priority.HIGH || _timestamp > currTime) {
          txnIdList[i] = _id;
          txnIdList[j] = currId;
          j++;
        } 
      }
    } else { // shift to the left
      highPriorityCount ++;
      if (_idx == 0) return ;
      for (i = _idx-1; i >= 0; i--) {
        currId = txnIdList[i];
        currTime = id2Txn[currId].timestamp;
        currPriority = id2Txn[currId].priority;
        if (currPriority == Priority.LOW || _timestamp < currTime) {
          txnIdList[i] = _id;
          txnIdList[j] = currId;
          j--;
        }
      }
    }
  }

  function arrayIndexOf(bytes32 _id) private view returns(uint){
    uint i;
    uint idx;
    for (i = 0; i<txnIdList.length; i++) {
      if (txnIdList[i] == _id) {
        idx = i;
        break;
      }
    }
  }
}

