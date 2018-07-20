pragma solidity ^0.4.19;

import "./safemath.sol";
import "./ownable.sol";

contract CardFactory is Ownable {

    using SafeMath for uint256;
    using SafeMath32 for uint32;
    using SafeMath16 for uint16;
    
    event NewCard(uint cardId, string company, uint dna);
    
    struct Card {
        string company;
        uint16 balance;
    }
    
    Card[] public cards;
    
    mapping (uint => address) public cardToOwner;
    mapping (address => uint) ownerCardCount;
    
    
    function createCard(string company, uint16 balance) public onlyOwner {
        uint id = cards.push(Card(company, balance));
        cardToOwner[id] = msg.sender;
        emit NewCard(id, company, balance);
    }
}