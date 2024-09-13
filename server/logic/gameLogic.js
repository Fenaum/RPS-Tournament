function createGame(player1, player2) {
  return {
    choices: ["rock", "paper", "scissors"],
    winningChoices: {
      rock: "scissors",
      paper: "rock",
      scissors: "paper",
    },
    player1: player1.username,
    player2: player2.username,
    gameState: {
      player1Score: 0,
      player2Score: 0,
      currentRound: 1,
      winner: "",
    },
    startRound: function () {
      let result = "";
      let player1Choice = this.choices[Math.floor(Math.random() * 3)];
      let player2Choice = this.choices[Math.floor(Math.random() * 3)];

      if (player1Choice === player2Choice) {
        result = "tie";
      } else if (this.winningChoices[player1Choice] === player2Choice) {
        result = `${this.player1} wins`;
        this.gameState.player1Score += 1;
      } else {
        result = `${this.player2} wins`;
        this.gameState.player2Score += 1;
      }
      this.gameState.currentRound++;
      return result;
    },
    startGame: function () {
      this.gameState.player1Score = 0;
      this.gameState.player2Score = 0;
      this.gameState.currentRound = 1;
    },
    playGame: function () {
      this.startGame();

      while (
        Math.abs(this.gameState.player1Score - this.gameState.player2Score) < 2
      ) {
        this.startRound();
      }
      this.gameState.winner =
        this.gameState.player1Score > this.gameState.player2Score
          ? this.player1
          : this.player2;
    },
  };
}

module.exports = { createGame };
