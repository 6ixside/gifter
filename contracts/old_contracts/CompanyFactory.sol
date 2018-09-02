pragma solidity ^0.4.24;
//pragma experimental ABIEncoderV2;

import "./ownable.sol";
contract CompanyFactory is Ownable {

    struct Company{
        address owner;
        bytes32 companyName;
        Card[] cards;
    }

    struct Card {
        bytes32 cardIconHash; //ipfs hash for the card
        uint256 dna;
    }

    mapping(address => Company) public owners;

    function createNewCompany(bytes32 name) external{
        require(owners[msg.sender].owner == address(0));
        
        Company storage c;
        c.owner = msg.sender;
        c.companyName = name;
        owners[msg.sender] = c;
    }
    
    function createNewCard(address owner, uint16 value, uint8 tradeable, bytes32 imageHash) external{
        require(owners[owner].owner != address(0));
        
        uint id = owners[owner].cards.length;
        
        //create a giftcard as a 256 bit binary object
        
        uint256 dna = uint256(owner); 
        dna |= uint256(value)<<160;
        dna |= uint256(tradeable)<<172;
        dna |= uint256(id)<<180;
        
        owners[owner].cards.push(Card(imageHash, dna));
    }
}

