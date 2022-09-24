// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;
import "hardhat/console.sol";

contract Casino {
    enum RedBlack {
        BLACK,
        RED
    }
    mapping(address => uint256) public gameAmount;
    mapping(address => uint256) public gameBlockHeight;
    mapping(address => RedBlack) public rougenoirBet;
    mapping(address => uint256) public playerBalance;
    mapping(uint256 => RedBlack) public colorValues;

    uint256 public contractFunds = 0;

    event GameResult(address indexed player, uint256 betAmount, bool won);
    event BetMade(
        address indexed player,
        uint256 amount,
        RedBlack bet,
        uint256 blockNumber
    );
    event FundsAdded(address indexed player, uint256 amount);
    event FundsWithdrawn(address indexed player, uint256 amount);

    constructor() payable {
        contractFunds = msg.value;
        setRedValues();
    }

    receive() external payable {
        playerBalance[msg.sender] += msg.value;
        emit FundsAdded(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external payable returns (bool) {
        require(playerBalance[msg.sender] >= amount, "Not enough funds!");
        playerBalance[msg.sender] -= amount;
        (bool success, ) = msg.sender.call{value: amount}("");
        emit FundsWithdrawn(msg.sender, amount);
        return success;
    }

    function getRouletteNumber(uint256 blockHeight)
        internal
        view
        returns (uint256)
    {
        uint256 blockHash = uint256(blockhash(blockHeight));

        return blockHash % 37;
    }

    function setRougeNoir(uint8 bet, uint256 betAmount) public returns (bool) {
        require(
            gameBlockHeight[msg.sender] == 0,
            "Finish your running game first!"
        );
        require(
            playerBalance[msg.sender] > betAmount,
            "Please top up your funds!"
        );

        RedBlack playerBet = RedBlack(bet);

        gameBlockHeight[msg.sender] = block.number + 1;
        playerBalance[msg.sender] -= betAmount;
        contractFunds += betAmount;
        gameAmount[msg.sender] = betAmount;
        rougenoirBet[msg.sender] = playerBet;
        emit BetMade(msg.sender, betAmount, playerBet, block.number + 1);
        return true;
    }

    function getRougeNoirPayout() public returns (bool) {
        require(
            blockhash(gameBlockHeight[msg.sender]) != 0,
            "Please make a bet first"
        );
        uint256 gameNumber = getRouletteNumber(gameBlockHeight[msg.sender]);
        if (gameNumber > 0) {
            RedBlack playerBet = rougenoirBet[msg.sender];
            uint256 playerAmount = gameAmount[msg.sender];
            RedBlack gameResult = getColorFromNumber(gameNumber);

            if (gameResult == playerBet) {
                playerBalance[msg.sender] += playerAmount * 2;
                contractFunds -= playerAmount * 2;
            }
        }

        resetRougeNoirGame();
        return true;
    }

    function getRougeNoirResult() public view returns (uint256) {
        require(
            blockhash(gameBlockHeight[msg.sender]) != 0,
            "Please make a bet first"
        );
        uint256 gameNumber = getRouletteNumber(gameBlockHeight[msg.sender]);
        return gameNumber;
    }

    function resetRougeNoirGame() internal {
        gameAmount[msg.sender] = 0;
        gameBlockHeight[msg.sender] = 0;
    }

    function getColorFromNumber(uint256 number)
        internal
        view
        returns (RedBlack)
    {
        return RedBlack(colorValues[number]);
    }

    function setRedValues() internal returns (bool) {
        uint8[18] memory redNumbers = [
            1,
            3,
            5,
            7,
            9,
            12,
            14,
            16,
            18,
            19,
            21,
            23,
            25,
            27,
            30,
            32,
            34,
            36
        ];
        for (uint i = 0; i < redNumbers.length; i++) {
            colorValues[redNumbers[i]] = RedBlack.RED;
        }
        return true;
    }
}
