pragma solidity ^0.4.24;

contract GifterUCACS{
	/*
	* @title: allowtrade
	* 
	* @description: use case authority function to determine if a trade can
	* occur between two entities, A and B
	* @params: partyA first party in the transaction
	* @params: partyB second party in the transaction
	* @return: boolean determines if the transaction is allowed
	*/
	function allowTrade(address partyA, address partyB, ..params) public returns bool{
		//read gifter profiles from both addresses

		//check the giftcards from both parties is marked as tradeable 

		//return
	}

	/*
	function allowRedeem(address from, address to) public returns bool{
		
	}

	function allowMarketplaceTrx(address from, address to) public returns bool{
		
	}

	function allowMarketplaceListing(address from, address to) public returns bool{
		
	}
	*/
}