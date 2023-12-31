// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

contract DeedMultiPayouts {
    address public lawyer;
    address payable public beneficiary;
    uint public earliest;
    uint public amount;
    uint constant public PAYOUTS = 10;
    uint constant public INTERVAL = 10;
    uint public paidPayouts;

    constructor(
        address _lawyer,
        address payable _beneficiary,
        uint fromNow
        ) payable {
        lawyer = _lawyer;
        beneficiary = _beneficiary;
        earliest = block.timestamp + fromNow;
        amount = msg.value / PAYOUTS;
    }

    function withdraw() public {
        require(msg.sender == beneficiary, 'Beneficiary only');
        require(block.timestamp >= earliest, 'Too early');
        require(paidPayouts < PAYOUTS, 'No payouts left');
        uint elligiblePayouts = (block.timestamp - earliest) / INTERVAL;
        uint duePayouts = elligiblePayouts - paidPayouts;
        duePayouts = (duePayouts + paidPayouts) > PAYOUTS ? (PAYOUTS - paidPayouts) : duePayouts;
        paidPayouts += duePayouts;
        beneficiary.transfer(duePayouts * amount);
    }
}