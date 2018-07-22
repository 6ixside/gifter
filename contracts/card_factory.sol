pragma solidity ^0.4.19;

import "./ownable.sol";

contract CardFactory is Ownable {

    event NewCard(uint indexed cardId, string indexed company, uint indexed dna);

    struct Card {
        string company;
        uint16 balance;
        bool canTrade;
    }

    Card[] public cards;

    mapping (uint => address) public cardToOwner;
    mapping (address => uint) ownerCardCount;

    function createCard(string company, uint16 balance) public onlyOwner {
        uint id = cards.push(Card(company, balance, true));
        cardToOwner[id] = msg.sender;
        ownerCardCount[msg.sender]++;
        emit NewCard(id, company, balance);
    }

    function getInventory(address _owner) public view returns (uint[]) {
      uint[] memory result = new uint[](ownerCardCount[_owner]);
      uint counter = 0;
      for (uint i = 0; i < cards.length; i++) {
        if (cardToOwner[i] == _owner) {
          result[counter] = i;
          counter++;
        }
      }
      return result;
    }
}
