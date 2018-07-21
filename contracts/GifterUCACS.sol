pragma solidity ^0.4.24;

import "./card_factory.sol";

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
	function allowTrade(address partyA, address partyB, uint cardIdA, uint cardIdB) public returns bool{
		//check that card a belongs to party a,
		//card b belongs to party b,
		//and the retailer that created the giftcard has indicated
		//that the giftcards can be traded (for both cards)
		if(cardToOwner[cardIdA] != partyA || 
		   cardToOwner[cardIdB] != partyB ||
		   !cards[cardIdA].canTrade ||
		   !cards[cardIdB].canTrade){
			return false;
		}

		return true;
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
