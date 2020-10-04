pragma solidity ^0.5.0;

import "./KrellKoin.sol";
import "./DaiToken.sol";

contract TokenFarm {
    string public name = "KrellKrop";
    KrellKoin public krellKoin;
    DaiToken public daiToken;
    address[] public stakers;
    address public owner;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;
    

    constructor(KrellKoin _krellKoin, DaiToken _daiToken) public {
        krellKoin = _krellKoin;
        daiToken = _daiToken;
        owner = msg.sender;
    }
    // StakingTokens (deposit)
    function stakeTokens(uint _amount) public{
    	//require greater then 0
    	require(_amount > 0, "amount cannot be 0");
    	//xfer mock dai to contract for staking 
    	daiToken.transferFrom(msg.sender, address(this), _amount);
    	//update stacking balance
    	stakingBalance[msg.sender] = stakingBalance[msg.sender]+ _amount;
    	//add users to stakers only if they have not staked
    	if(!hasStaked[msg.sender]){
			stakers.push(msg.sender);
    	}
    	//update staking status
    	isStaking[msg.sender] = true;
    	hasStaked[msg.sender] = true;
    }
    //Unstaking Tokens (withdraw)
    function unstakeTokens() public{
    	//fetch staking balance
    	uint balance = stakingBalance[msg.sender];
    	//require greater then 0
    	require(balance > 0, "staking balance cannot be 0");
    	//xfer mock dai to contract for staking 
    	daiToken.transfer(msg.sender, balance);
    	//update stacking balance
    	stakingBalance[msg.sender] = 0;
    	//update staking status
    	isStaking[msg.sender] = false;
    }
    // Issueing tokens
    function issueTokens() public{
    	require(msg.sender == owner, "caller must be owner");
    	for(uint i=0; i<stakers.length; i++){
    		address recipient = stakers[i];
    		uint balance = stakingBalance[recipient];
    		if(balance > 0){
    		krellKoin.transfer(recipient, balance);
    		}
    	}
    }
}
