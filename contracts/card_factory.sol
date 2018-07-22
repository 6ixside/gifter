pragma solidity ^0.4.19;

import "./ownable.sol";

contract CardFactory is Ownable {

    event NewCard(uint indexed cardId, string indexed company, uint indexed dna);

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
        ownerCardCount[msg.sender]++;
        emit NewCard(id, company, balance);
    }
}
