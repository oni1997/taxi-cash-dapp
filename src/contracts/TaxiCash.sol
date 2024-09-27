// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TaxiCash {
    address public owner;
    uint256 public constant FEE_PERCENTAGE = 5;

    // Referral code mapping
    mapping(string => address) public referralCodes;
    mapping(address => uint256) public userRewards;

    event PaymentSent(address indexed from, address indexed to, uint256 amount, uint256 fee);
    event ReferralApplied(string code, address indexed user);

    constructor() {
        owner = msg.sender;
    }

    function sendPayment(address payable _recipient) public payable {
        require(msg.value > 0, "Payment amount must be greater than 0");

        uint256 fee = (msg.value * FEE_PERCENTAGE) / 100;
        uint256 amountAfterFee = msg.value - fee;

        _recipient.transfer(amountAfterFee);
        payable(owner).transfer(fee);

        emit PaymentSent(msg.sender, _recipient, amountAfterFee, fee);
    }

    function withdrawFees() public {
        require(msg.sender == owner, "Only the owner can withdraw fees");
        payable(owner).transfer(address(this).balance);
    }

    function referUser(string memory code) public {
        require(referralCodes[code] != address(0), "Invalid referral code");
        userRewards[msg.sender] += 10; // Example reward for applying a referral code
        emit ReferralApplied(code, msg.sender);
    }

    function registerReferralCode(string memory code) public {
        require(referralCodes[code] == address(0), "Code already exists");
        referralCodes[code] = msg.sender; // Register the referral code to the user
    }

    function getUserRewards(address user) public view returns (uint256) {
        return userRewards[user];
    }
}