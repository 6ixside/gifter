pragma solidity ^0.4.24;
//pragma experimental ABIEncoderV2;

import "./ownable.sol";

contract CardFactory is Ownable {


    event NewCard(uint indexed cardId, uint200 indexed company, uint indexed dna);

    struct Card {
        uint200 company;
        uint16 balance;
        bool canTrade;
    }

    Card[] public cards;

    mapping (uint => address) public cardToOwner;
    mapping (uint => bool) public isTrading;
    mapping (uint => string) public tradingFor;
    mapping (address => uint256[]) public inventories; //make it a mapping to uint array

    function _randMod(uint _modulus) internal view returns(uint) {
      return uint256(keccak256(abi.encodePacked(msg.sender, uint256(now), uint256(0)))) % _modulus;
    }

    function createRandomCard() external{
      bytes25[6] memory companies = [bytes25(0x42616e616e612052657075626c6963), //banana republic
                                     bytes25(0x48264d),  //h&m
                                     bytes25(0x43616e616469616e2054697265), //canadian tire
                                     bytes25(0x546f6d6d792048696c6669676572), //tommy Hilfiger
                                     bytes25(0x4d4543), //mec
                                     bytes25(0x4775636369)]; //gucci
      uint8[6] memory values = [5, 10, 15, 25, 50, 100];

      uint200 _company = uint200(companies[_randMod(companies.length)]);
      uint16 _balance = values[_randMod(values.length)];

      uint32 id = uint32(cards.push(Card(_company, _balance, true)));
      
      cardToOwner[id] = msg.sender;
      isTrading[id] = false;

      //create a giftcard as a 256 bit binary object
      uint256 card = uint256(_company);  
      card |= uint256(_balance)<<200;
      card |= uint256(0)<<216;
      card |= uint256(id)<<224;

      inventories[msg.sender].push(card);
      emit NewCard(id, _company, 0);
    }

    function getInventory(address _owner) public view returns(uint256[], uint256[], uint256[], uint256[], uint256[]){
      uint256[] memory rowsub = new uint256[](inventories[_owner].length < 4 ? inventories[_owner].length : 4); //get 4 cards at a time unless there are less than 4 cards to get
      uint256[] memory companies = new uint256[](inventories[_owner].length < 4 ? inventories[_owner].length : 4);
      uint256[] memory balances = new uint256[](inventories[_owner].length < 4 ? inventories[_owner].length : 4);
      uint256[] memory trades = new uint256[](inventories[_owner].length < 4 ? inventories[_owner].length : 4);
      uint256[] memory ids = new uint256[](inventories[_owner].length < 4 ? inventories[_owner].length : 4);

      for(uint i = 0; i < (inventories[_owner].length < 4 ? inventories[_owner].length : 4); i++){
          rowsub[i] = inventories[_owner][i];

          companies[i] = uint256(uint200(rowsub[i]));
          balances[i] = uint256(uint16(rowsub[i]>>200));
          trades[i] = uint256(uint8(rowsub[i]>>216));
          ids[i] = uint256(uint32(rowsub[i]>>224));
      }

      return (companies, balances, trades, ids);
    }
}
