# Queue Mechansim with netting

### Test Case 0: Contract should be deployed



### Test Case 1: Transfer with Sufficient Balance: 

Before: `A (Bal: 10) B(Bal: 0)`

Transfer: `A -> B with 5 tokens`

Expected: 

* `A(Bal: 5) B(Bal: 5)` 

### Test Case 2: Transfer with inSufficient Balance: 

Before: ` B(Bal: 5) C(Bal: 0)`

Transfer: `B -> C with 10 tokens`

Expected:

* `balance: B(Bal: 5) C(Bal: 0)` 
* `This transaction is stored in queue`

### Test Case 3: Updating priority: 

Before: `B->C w/10 in queue`

Transfer: `C->B w/15 high priority`

Expected:

* ` C->B w/15 is put in front` 
* two txns in queue

### Test Case 4: Can perform bilateral netting

Before: two txns are stored in queue

* `B->C w/10`
* `C->B w/15`

Run: trigger netting

Expected:

- ` C->B w/5 in queue`
- queue depth is `1` 

### Test Case 5: The queue can be released

Before: issue 5 tokens to C

Run: release queue

Expected:

- `B(10)`
- queue depth is 0 

