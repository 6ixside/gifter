pragma solidity ^0.4.24;
//pragma experimental ABIEncoderV2;

import "./ownable.sol";
import "./CompanyFactory.sol";

contract CardUtil {

	CompanyFactory cf;

	struct Trade{
		//uint16 id;
		//address from;
		uint256 tradeDna; //has the id, the from address, and whether or not the trade is a gift
		uint256[] offeredCards;
		uint256[] wantedCards;
	}

	mapping (address => uint256[]) public openTrades;
	Trade[] trades;

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
		uint16 loc = locateFreeInventory(consumer);

		inventories[consumer][loc] = dna;
	}

	/*determines the first available free inventory spot for a card to be added to the users inventory*/
	function locateFreeInventory(address user) internal returns(uint16){
		for(uint i = 0; i < inventories[user].length; i++){
			if(inventories[user][i] == uint256(0)){
				return i;
			}

			require(i <= 65535, 'inventory full');
		}

		return inventories[user].length;
	}

	function initiateTrade(address from, address to, uint1 isGift, uint16[] fromTrades, uint16[] toTrades, uint8[] v, bytes32[] r, bytes32[] s) public{
		require(validateTransaction(from, to, v, r, s));
		require(to != address(0));
		require(from != address(0));
		require(to != from);

		//ensures every card in the trade agreement is tradeable from the consumer perspective
		for(uint i = 0; i < toTrades.length; i++){ require(uint8(toCards[i]>>176) == 1, 'Cannot trade card'); }
		for(uint i = 0; i < fromTrades.length; i++){ require(uint8(fromCards[i]>>176) == 1, 'Cannot trade card'); } 

		uint16 id = trades[to].length;

		uint256 tradeDna = uint256(from);  
    tradeDna |= uint256(id)<<160;
    tradeDna |= uint256(isGift)<<176;

    tradeId = trades.push(Trade(tradeDna, toTrades, fromTrades));
    openTrades[to].push(tradeId);
    openTrades[from].push(tradeId);
	}

	function resolveTrade(address receiver, uint tradeId, uint1 status, uint8[] v, bytes32[] r, bytes32[] s) public{
		uint256 trader = uint256(uint160(trades[receiver][tradeId].tradeDna));
		require(validateTransaction(receiver, trader, v, r, s));

		if(status == 1){
			tradeCard(receiver, trader, tradeId);
		}
		else{
			for(uint i = 0; i < openTrades[receiver].length; i++){
				if(openTrades[receiver][i] == tradeId){
					delete openTrades[receiver][i];
				}
			}

			for(uint i = 0; i < openTrades[trader].length; i++){
				if(openTrades[trader][i] == tradeId){
					delete openTrades[trader][i];
				}
			}

			delete trades[tradeId];
		}
	}
	
	function tradeCard(address receiver, address trader, uint256 tradeId) internal{
		uint16 loc;

		for(uint i = 0; i < trades[tradeId].offeredCards.length){
			loc = locateFreeInventory(receiver);
			inventories[receiver][loc] = inventories[trader][trades[tradeId].offeredCards[i]];
			delete inventories[trader][trades[tradeId].offeredCards[i]];
		}

		for(uint i = 0; i < trades[tradeId].wantedCards.length){
			loc = locateFreeInventory(trader);
			inventories[trader][loc] = inventories[receiver][trades[tradeId].wantedCards[i]];
			delete inventories[receiver][trades[tradeId].wantedCards[i]];
		}

		delete trades[tradeId];
	}

	function cancelTrades(address receiver, address trader, uint256 tradeId) internal{

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