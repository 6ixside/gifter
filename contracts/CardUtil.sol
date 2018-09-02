pragma solidity ^0.4.24;
//pragma experimental ABIEncoderV2;

import "./ownable.sol";
import "./CompanyFactory.sol";

contract CardUtil is CompanyFactory {

	mapping (address => uint256[]) public inventories;

	function purchaseCard(address companyAddress, uint16 cardPosition) external{
		inventories[msg.sender].push(owners[companyAddress].cards[cardPosition].dna);
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
        trades[i] = uint256(uint8(rowsub[i]>>172));
        ids[i] = uint256(uint16(rowsub[i]>>180));
    }

    return (companies, balances, trades, ids, rowsub);
  }
}