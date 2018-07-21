pragma solidity ^0.4.19;

import "./ownable.sol";

contract CardFactory is Ownable {

    event NewCard(uint cardId, string company, uint dna);

    struct Card {
        string company;
        uint16 balance;
        bool canTrade;
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
