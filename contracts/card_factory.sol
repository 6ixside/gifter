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
    mapping (uint => bool) public isTrading;
    mapping (uint => string) public tradingFor;
    mapping (address => uint) ownerCardCount;

    function _randMod(uint _modulus) internal view returns(uint) {
      return uint256(keccak256(abi.encodePacked(msg.sender, uint256(now), uint256(0)))) % _modulus;
    }

    function _createCard(string _company, uint16 _balance) internal {
        uint id = cards.push(Card(_company, _balance, true));
        cardToOwner[id] = msg.sender;
        isTrading[id] = false;
        ownerCardCount[msg.sender]++;
        emit NewCard(id, _company, _balance);
    }

    function createRandomCard() public {
      string[6] memory companies = ["Banana Republic", "H&M", "Canadian Tire", "Tommy Hilfiger", "MEC", "Gucci"];
      uint8[6] memory values = [5, 10, 15, 25, 50, 100];
      _createCard(companies[_randMod(companies.length)], values[_randMod(values.length)]);
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
