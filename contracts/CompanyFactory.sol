pragma solidity ^0.4.24;
//pragma experimental ABIEncoderV2;

import "./ownable.sol";

contract CompanyFactory {

	mapping(address => Company) public owners;
	mapping(address => bool) public exists;

	function getOwner(address a) public view returns(Company){
		return owners[a];
	}

	function createNewCompany(bytes32 name) public returns(address){
		if(exists[msg.sender]){
			revert("Company already exists");
		}

		owners[msg.sender] = new Company(msg.sender, name);
		exists[msg.sender] = true;

		return owners[msg.sender].getContractAddress();
	}

	constructor() public{

	}
}

contract Company is Ownable{
	address owner;
	bytes32 companyName;

	struct Card {
		bytes32 cardIconHash;
    uint256 dna;
  }

	Card[] cards;

	function getOwner() public view returns(address){
		return owner;
	}

	function getContractAddress() public view returns(address){
		return this;
	}

	function getCardDnas() public view returns(uint256[]){
		uint256[] memory r = new uint256[](cards.length);

		for(uint i = 0; i < cards.length; i++){
			r[i] = cards[i].dna;
		}

		return r;
	}

	function createNewCard(uint16 value, uint8 tradeable, bytes32 imageHash) public{
		require(msg.sender == owner);

		uint id = cards.length;

		//create a giftcard as a 256 bit binary object
    uint256 dna = uint256(owner);  
    dna |= uint256(value)<<160;
    dna |= uint256(tradeable)<<172;
    dna |= uint256(id)<<180;

    cards.push(Card(imageHash, dna));
	}

	constructor(address a, bytes32 name) public{
		transferOwnership(a);
		owner = a;
		companyName = name;
	}
}
