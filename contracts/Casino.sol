// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;
import "hardhat/console.sol";

contract Casino {
    enum RedBlack {
        BLACK,
        RED
    }
    mapping(address => uint256) public rougenoirAmount;
    mapping(address => RedBlack) public rougenoirBet;
    mapping(address => uint256) public rougenoirBlockHeight;
    mapping(address => uint256) public playerBalance;

    event GameResult(address indexed player, uint256 betAmount, bool won);
    event BetMade(
        address indexed player,
        uint256 amount,
        RedBlack bet,
        uint256 blockNumber
    );
    event FundsAdded(address indexed player, uint256 amount);
    event FundsWithdrawn(address indexed player, uint256 amount);

    constructor() payable {}

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

    function setRougeNoir(uint8 bet, uint256 betAmount) public returns (bool) {
        require(
            rougenoirBlockHeight[msg.sender] == 0,
            "Finish your running game first!"
        );
        require(
            playerBalance[msg.sender] > betAmount,
            "Please top up your funds!"
        );

        RedBlack playerBet = RedBlack(bet);

        rougenoirBlockHeight[msg.sender] = block.number + 2;
        playerBalance[msg.sender] -= betAmount;
        rougenoirAmount[msg.sender] = betAmount;
        rougenoirBet[msg.sender] = playerBet;
        emit BetMade(msg.sender, betAmount, playerBet, block.number + 2);
        return true;
    }

    function getRougeNoirPayout() public returns (bool) {
        require(
            blockhash(rougenoirBlockHeight[msg.sender]) != 0,
            "Please make a bet first"
        );
        uint256 blockHash = uint256(
            blockhash(rougenoirBlockHeight[msg.sender])
        );
        RedBlack playerBet = rougenoirBet[msg.sender];
        RedBlack gameResult = RedBlack(blockHash % 2);
        bool success = false;

        if (gameResult == playerBet) {
            uint256 payout = rougenoirAmount[msg.sender] * 2;
            emit GameResult(msg.sender, payout, true);
            playerBalance[msg.sender] += payout;
        } else {
            emit GameResult(msg.sender, 0, false);
        }
        resetRougeNoirGame();
        return success;
    }

    function getRougeNoirResult() public view returns (bool) {
        require(
            blockhash(rougenoirBlockHeight[msg.sender]) != 0,
            "Please make a bet first"
        );
        uint256 blockHash = uint256(
            blockhash(rougenoirBlockHeight[msg.sender])
        );
        RedBlack playerBet = rougenoirBet[msg.sender];
        RedBlack gameResult = RedBlack(blockHash % 2);

        if (gameResult == playerBet) {
            return true;
        }
        return false;
    }

    function getContractFunds() external view returns (uint256) {
        return address(this).balance;
    }

    function resetRougeNoirGame() internal {
        rougenoirAmount[msg.sender] = 0;
        rougenoirBlockHeight[msg.sender] = 0;
    }
}
