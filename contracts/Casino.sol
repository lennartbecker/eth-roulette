// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;
import "hardhat/console.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Casino is ReentrancyGuard {
    enum RedBlack {
        BLACK,
        RED
    }
    mapping(uint256 => RedBlack) public colorValues;

    mapping(address => uint256) public redBlackAmount;
    mapping(address => uint256) public redBlackBlockHeight;
    mapping(address => RedBlack) public redblackBet;

    mapping(address => uint256) public pleinBetAmount;
    mapping(address => uint256) public pleinBetBlockHeight;
    mapping(address => uint256) public pleinBet;

    mapping(address => uint256) public playerBalance;

    uint256 public contractFunds = 0;

    event GameResult(address indexed player, uint256 betAmount, bool won);
    event BetMade(
        address indexed player,
        uint256 amount,
        uint256 blockNumber,
        string gameType
    );
    event FundsAdded(address indexed player, uint256 amount);
    event FundsWithdrawn(address indexed player, uint256 amount);
    event GameReset(address indexed player);

    modifier isGameMode(uint256 betAmount) {
        require(
            playerBalance[msg.sender] >= betAmount,
            "Please top up your funds!"
        );
        _;
    }

    constructor() payable {
        contractFunds = msg.value;
        setRedValues();
    }

    receive() external payable {
        playerBalance[msg.sender] += msg.value;
        emit FundsAdded(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external payable nonReentrant returns (bool) {
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

    function setRedBlack(uint8 bet, uint256 betAmount)
        public
        isGameMode(betAmount)
    {
        require(betAmount <= contractFunds, "Bet amount is too high");
        require(
            redBlackBlockHeight[msg.sender] == 0,
            "Finish your running game first!"
        );

        RedBlack playerBet = RedBlack(bet);

        redBlackBlockHeight[msg.sender] = block.number + 1;
        playerBalance[msg.sender] -= betAmount;
        contractFunds += betAmount;
        redBlackAmount[msg.sender] = betAmount;
        redblackBet[msg.sender] = playerBet;
        emit BetMade(msg.sender, betAmount, block.number + 1, "RedNoir");
    }

    function getRedBlackPayout() public {
        require(
            blockhash(redBlackBlockHeight[msg.sender]) != 0,
            "Please make a bet first"
        );
        uint256 gameNumber = getRouletteNumber(redBlackBlockHeight[msg.sender]);
        if (gameNumber > 0) {
            RedBlack playerBet = redblackBet[msg.sender];
            uint256 playerAmount = redBlackAmount[msg.sender];
            RedBlack gameResult = getColorFromNumber(gameNumber);

            if (gameResult == playerBet) {
                playerBalance[msg.sender] += playerAmount * 2;
                contractFunds -= playerAmount * 2;
            }
        }

        resetRedBlackGame();
    }

    function resetRedBlackGame() internal {
        emit GameReset(msg.sender);
        redBlackAmount[msg.sender] = 0;
        redBlackBlockHeight[msg.sender] = 0;
    }

    function setPleinBet(uint256 bet, uint256 betAmount)
        external
        isGameMode(betAmount)
    {
        require(betAmount * 35 <= contractFunds, "Bet amount is too high");
        require(
            pleinBetBlockHeight[msg.sender] == 0,
            "Finish your running game first!"
        );
        require(bet <= 36, "Bad value");

        pleinBet[msg.sender] = bet;
        pleinBetAmount[msg.sender] = betAmount;
        pleinBetBlockHeight[msg.sender] = block.number + 1;
        playerBalance[msg.sender] -= betAmount;
        contractFunds += betAmount;

        emit BetMade(msg.sender, betAmount, block.number + 1, "Plein");
    }

    function getPleinPayout() external {
        require(
            blockhash(pleinBetBlockHeight[msg.sender]) != 0,
            "Please make a bet first"
        );

        uint256 gameNumber = getRouletteNumber(pleinBetBlockHeight[msg.sender]);
        if (gameNumber == pleinBet[msg.sender]) {
            playerBalance[msg.sender] += pleinBetAmount[msg.sender] * 35;
            contractFunds -= pleinBetAmount[msg.sender] * 35;
        }

        resetPleinGame();
    }

    function resetPleinGame() internal {
        pleinBetAmount[msg.sender] = 0;
        pleinBetBlockHeight[msg.sender] = 0;
        emit GameReset(msg.sender);
    }

    //Gamemodes: 0 = RedBlack, 1 = plein

    function getGameResult(uint8 gamemode) public view returns (uint256) {
        if (gamemode == 0) {
            require(
                blockhash(redBlackBlockHeight[msg.sender]) != 0,
                "Please make a bet first"
            );
            return getRouletteNumber(redBlackBlockHeight[msg.sender]);
        } else if (gamemode == 1) {
            require(
                blockhash(pleinBetBlockHeight[msg.sender]) != 0,
                "Please make a bet first"
            );
            return getRouletteNumber(pleinBetBlockHeight[msg.sender]);
        }
        return 0;
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
