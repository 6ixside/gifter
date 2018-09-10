pragma solidity ^0.4.24;
//pragma experimental ABIEncoderV2;

import "./ownable.sol";
import "./CompanyFactory.sol";

contract CardUtil {

	CompanyFactory cf;

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

		uint256 dna = cf.getOwner(companyAddress).getCardDnas()[cardPosition];

		inventories[consumer].push(dna);
	}
	
	function tradeCard(address from, address to, uint16[] fromTrades, uint16[] toTrades) public {
	    
	}

	function getInventory(address _owner) public view returns(uint256[], uint256[], uint256[], uint256[], uint256[]){
    uint256[] memory rowsub = new uint256[](inventories[_owner].length < 4 ? inventories[_owner].length : 4); //get 4 cards at a time unless there are less than 4 cards to get
    uint256[] memory companies = new uint256[](inventories[_owner].length < 4 ? inventories[_owner].length : 4);
    uint256[] memory balances = new uint256[](inventories[_owner].length < 4 ? inventories[_owner].length : 4);
    uint256[] memory trades = new uint256[](inventories[_owner].length < 4 ? inventories[_owner].length : 4);
    uint256[] memory ids = new uint256[](inventories[_owner].length < 4 ? inventories[_owner].length : 4);

    for(uint i = 0; i < (inventories[_owner].length < 4 ? inventories[_owner].length : 4); i++){
        rowsub[i] = inventories[_owner][i];

        companies[i] = uint256(uint160(rowsub[i]));
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