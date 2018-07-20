pragma solidity ^0.4.19;

import "./card_factory";

contract CardTrading {
    
    event tradeSuccess(address playerOne, address playerTwo, uint256 cardIdOne, uint256 cardIdTwo);
    
    function trade(address _playerTwo, uint256 _cardIdOne,
        uint256 _cardIdTwo) public {
            require(cardToOwner[_cardIdOne] == msg.sender);
            require(cardToOwner[_cardIdTwo] == _playerTwo);
            cardToOwner[_cardIdOne] = _playerTwo;
            cardToOwner[_cardIdTwo] = _playerOne;
        }
}