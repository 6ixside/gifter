pragma solidity ^0.4.19;

import "./card_factory.sol";

contract CardTrading is CardFactory {
    /* For cases when functions need to be restricted to owners */
    modifier onlyOwnerOf(uint _cardId) {
        require(msg.sender == cardToOwner[_cardId]);
        _;
    }
    /* Ensure that the card is up for trade */
    modifier onlyTrading(uint _cardId) {
        require(isTrading[_cardId]);
        _;
    }

    /* Ensure that the card being sent for the trade is what the user requested */
    modifier onlyValidOffer(uint _cardOne, uint _cardTwo) {
        require(keccak256(abi.encodePacked(tradingFor[_cardOne])) == keccak256(abi.encodePacked(cards[_cardTwo].company)));
        _;
    }

    event Transfer(address indexed _from, address indexed _to, uint256 indexed cardId);

    function ownerOf(uint256 _cardId) public view returns (address _owner) {
        return cardToOwner[_cardId];
    }

    function openTrading(uint256 _cardId, string company) public onlyOwnerOf(_cardId) {
        isTrading[_cardId] = true;
        tradingFor[_cardId] = company;
    }

    function closeTrading(uint256 _cardId) public onlyOwnerOf(_cardId) {
        isTrading[_cardId] = false;
        tradingFor[_cardId] = "";
    }

    /* Make Trade
    _cardOne: ID of the card open for Trade
    _cardTwo: msg.sender's card fulfilling the trade
     */
    function makeTrade(uint256 _cardOne, uint256 _cardTwo) public onlyOwnerOf(_cardTwo) onlyTrading(_cardOne) onlyValidOffer(_cardOne, _cardTwo){
        _swapCards(cardToOwner[_cardOne], cardToOwner[_cardTwo], _cardOne, _cardTwo);
    }


    /* Internal functions for performing the transfer of ownership */
    function _transfer(address _from, address _to, uint256 _cardId) private onlyOwnerOf(_cardId){
        cardToOwner[_cardId] = _to;
        emit Transfer(_from, _to, _cardId);
    }

    function _swapCards(address _playerOne, address _playerTwo, uint _cardOne, uint _cardTwo) private {
        _transfer(_playerOne, _playerTwo, _cardOne);
        _transfer(_playerTwo, _playerOne, _cardTwo);
    }


}
