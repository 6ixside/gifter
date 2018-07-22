pragma solidity ^0.4.19;

import "./card_factory.sol";

contract CardTrading is CardFactory {

    mapping (uint => address) tradeApprovals;

    modifier onlyOwnerOf(uint _cardId) {
      require(msg.sender == cardToOwner[_cardId]);
      _;
    }

    event Transfer(address indexed _from, address indexed _to, uint256 indexed cardId);

    event Approval(address indexed _from, address indexed _to, uint256 indexed cardId);

    function ownerOf(uint256 _cardId) public view returns (address _owner) {
        return cardToOwner[_cardId];
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

    function transfer(address _to, uint256 _cardId) public onlyOwnerOf(_cardId){
        _transfer(msg.sender, _to, _cardId);
    }

    function approve(address _to, uint256 _cardId) public onlyOwnerOf(_cardId){
        tradeApprovals[_cardId] = _to;
        emit Approval(msg.sender, _to, _cardId);
    }

    function takeOwnership(uint256 _cardId) public {
        require(tradeApprovals[_cardId] == msg.sender);
        address owner = ownerOf(_cardId);
        _transfer(owner, msg.sender, _cardId);
    }

    function _transfer(address _from, address _to, uint256 _cardId) private {
          cardToOwner[_cardId] = _to;
          ownerCardCount[_from]--;
          ownerCardCount[_from]++;
          emit Transfer(_from, _to, _cardId);
    }
}
