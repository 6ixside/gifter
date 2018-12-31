pragma solidity ^0.4.24;
//pragma experimental ABIEncoderV2;

import "./ownable.sol";
import "./CompanyFactory.sol";

contract CardUtil {

	CompanyFactory cf;

	struct Trade{
		uint16 id;
		address from;
		uint256[] toCards;
		uint256[] fromCards;
	}

	mapping (address => Trade[]) public trades;
	mapping (address => uint256[]) public inventories;
	mapping (address => mapping (address => uint256)) public nonceSet;
	
	bytes prefix = "\x19Ethereum Signed Message:\n32";
	
	//address a will be consumer, address b will be retailer
	//returns true or reverts
	function validateTransaction(address a, address b, uint8[] v, bytes32[] r, bytes32[] s) internal returns(bool){
    uint256 nonce = getNonce(a, b);
    bytes32 check = keccak256(prefix, keccak256(a, b, nonce));
    
    require(ecrecover(check, v[0], r[0], s[0]) == a, 'address check invalid');

    //commenting for now while shopify end is in dev
    //require(ecrecover(check, v[1], r[1], s[1]) == b);
    
    return true;
	}

	function purchaseCard(address consumer, address companyAddress, uint16 cardPosition, uint8[] v, bytes32[] r, bytes32[] s) public{
		require(validateTransaction(consumer, companyAddress, v, r, s));

		uint256 dna = cf.getCompany(companyAddress).getCardDnas()[cardPosition];

		inventories[consumer].push(dna);
	}

	function initiateTrade(address to, address from, uint256[] toCards, uint256[] fromCards) public{
		require(to != address(0));
		require(from != address(0));
		require(to != from);

		//ensures every card in the trade agreement is tradeable from the consumer perspective
		for(uint i = 0; i < toTrades.length; i++){ require(uint8(toCards[i]>>176) == 1, 'Cannot trade card'); }
		for(uint i = 0; i < fromTrades.length; i++){ require(uint8(fromCards[i]>>176) == 1, 'Cannot trade card'); } 

		trades[to].push(Trade(
			trades[to].length,
			from,
			toCards,
			fromCards
		));
	}
	
	//is internal because it should be called by helper functions which gather the respective v r and s values from both parties in the trade
	function tradeCard(address from, address to, uint16[] fromTrades, uint16[] toTrades, uint8[] v, bytes32[] r, bytes32[] s) internal{
		require(validateTransaction(from, to, v, r, s));

		/*trade card logic*/
	}

	function getInventory(address _owner, uint16 offset) public view returns(bytes32[], uint256[], uint256[], uint256[], uint256[]){
    uint256[] memory rowsub = new uint256[](inventories[_owner].length < 4 ? inventories[_owner].length : 4); //get 4 cards at a time unless there are less than 4 cards to get
    bytes32[] memory companies = new bytes32[](inventories[_owner].length < 4 ? inventories[_owner].length : 4);
    uint256[] memory balances = new uint256[](inventories[_owner].length < 4 ? inventories[_owner].length : 4);
    uint256[] memory trades = new uint256[](inventories[_owner].length < 4 ? inventories[_owner].length : 4);
    uint256[] memory ids = new uint256[](inventories[_owner].length < 4 ? inventories[_owner].length : 4);

    for(uint i = 0; i < (inventories[_owner].length < 4 ? inventories[_owner].length : 4); i++){
        rowsub[i] = inventories[_owner][offset + i];

        //first 160 bits is the company address, so we want to get the name of that company (i.e. canadian tire)
        companies[i] = cf.getCompany(uint256(uint160(rowsub[i]))).getCompanyName();

        balances[i] = uint256(uint16(rowsub[i]>>160));
        trades[i] = uint256(uint8(rowsub[i]>>176));
        ids[i] = uint256(uint16(rowsub[i]>>184));
    }

    return (companies, balances, trades, ids, rowsub);
  }
  
  function getNonce(address a, address b) public view returns (uint256){
    require(a != address(0), 'consumer null');
    require(b != address(0), 'retailer null');
    require(a != b, 'same address');
    
    if(a < b){
        return nonceSet[a][b];
    }
    
    return nonceSet[b][a];
  }

  constructor(address a) public{
  	cf = CompanyFactory(a);
  }
}