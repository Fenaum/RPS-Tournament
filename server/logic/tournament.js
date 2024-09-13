const { createGame } = require("./gameLogic");

function createTournament(...players) {
  return {
    brackets: {},
    round: 1,
    winner: null,
    initializeBrackets: function () {
      if (players.length % 4 === 0) {
        this.initializeRound(players, this.round);
      } else {
        console.log("Not enough players");
      }
    },
    initializeRound: function (roundPlayers, roundNumber) {
      this.brackets[`round${roundNumber}`] = [];
      for (let i = 0; i < roundPlayers.length; i += 2) {
        let player1 = roundPlayers[i];
        let player2 = roundPlayers[i + 1];
        this.brackets[`round${roundNumber}`].push({
          player1,
          player2,
          winner: "",
        });
      }
    },
    startTournament: function () {
      for (let round in this.brackets) {
        for (let pair of this.brackets[round]) {
          let game = createGame(pair.player1, pair.player2);
          game.playGame();
          pair.winner = game.gameState.winner;
        }
      }

      let nextRoundPlayers = this.brackets[`round${this.round}`].map((pair) => {
        return { username: pair.winner };
      });
      console.log(this.brackets);
      this.round++;
      if (nextRoundPlayers.length >= 2) {
        this.initializeRound(nextRoundPlayers, this.round);
        this.startTournament();
      } else if (nextRoundPlayers.length === 1) {
        this.winner = nextRoundPlayers[0];
        console.log(this.winner);
      }
    },
  };
}

let testPlayers = [
  { username: "john" },
  { username: "Vayne" },
  { username: "Jane" },
  { username: "Michael" },
  { username: "Sarah" },
  { username: "William" },
  { username: "Emily" },
  { username: "David" },
];

const testbrackets = createTournament(...testPlayers);
testbrackets.initializeBrackets();
testbrackets.startTournament();

module.exports = { createTournament };
