type PlayerChoice = "rock" | "paper" | "scissors";
type WinningChoices = {
  [key: string]: string;
};

export function createGame(player1: any, player2: any) {
  return {
    choices: ["rock", "paper", "scissors"] as PlayerChoice[],
    winningChoices: {
      rock: "scissors",
      paper: "rock",
      scissors: "paper",
    } as WinningChoices,
    player1: player1.name,
    player2: player2.name,
    gameState: {
      player1Score: 0,
      player2Score: 0,
      currentRound: 1,
      winner: "",
    },
    startRound: function () {
      let result: string = "";
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
      // Reset game state
      this.gameState.player1Score = 0;
      this.gameState.player2Score = 0;
      this.gameState.currentRound = 1;
    },
    playGame: function () {
      this.startGame(); //initialize the game state

      // winning condition
      while (
        Math.abs(this.gameState.player1Score - this.gameState.player2Score) < 2
      ) {
        let result = this.startRound();
        // console.log(result);
      }
      if (this.gameState.player1Score > this.gameState.player2Score) {
        this.gameState.winner = this.player1;
      } else {
        this.gameState.winner = this.player2;
      }
          // console.log(this.gameState.winner)
    },
  };
}

// let testPlayers = [
//   { name: "john" },
//   { name: "Vayne" },
//   { name: "Jane" },
//   { name: "Michael" },
//   { name: "Sarah" },
//   { name: "William" },
//   { name: "Emily" },
//   { name: "David" },
// ];

// const game = createGame(testPlayers[0], testPlayers[1]);
// game.playGame();
