pragma solidity ^0.4.0;

contract Lock {
	// 此合約的擁有者
	address private owner;

	// 儲存所有會員的餘額
	mapping (address => uint256) private balances;

	// 事件們，用於通知前端 web3.js
	
	event Unlock(int unlock);
	event TransferEvent(address from, address to, uint256 value, uint256 timestamp);
	// 建構子
	function Lock() {
		owner = msg.sender;
	}

	// 轉帳
	function transfer(address to, uint256 etherValue) {
		uint256 weiValue = etherValue * 1 ether;

		if (balances[msg.sender] < weiValue) {
			throw;
		}

		balances[msg.sender] -= weiValue;
		balances[to] += weiValue;
        
        Unlock(1);
		TransferEvent(msg.sender, to, etherValue, now);
	}

	// 檢查銀行帳戶餘額
	function checkBankBalance() constant returns (uint256) {
		return balances[msg.sender];
	}

	// 檢查以太帳戶餘額
	function checkEtherBalance() constant returns (uint256) {
		return msg.sender.balance;
	}
}
