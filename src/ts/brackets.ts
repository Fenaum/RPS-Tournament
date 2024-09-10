import { createGame } from "./gameLogic";

export function createBrackets(...players: any) {
  return {
    brackets: {} as { [key: string]: any[] },
    round: 1 as number, // start with round 1
    winner: null as any,
    initializeBrackets: function () {
      if (players.length % 4 === 0) {
        this.initializeRound(players, this.round);
      } else {
        console.log("Not enough players");
      }
    },
    initializeRound: function (roundPlayers: any[], roundNumber: number) {
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
      // Your logic for starting the tournament
      for (let round in this.brackets) {
        // console.log(this.brackets[round]);
        for (let pair of this.brackets[round]) {
          // const game = createGame(pair[0],pair[1])
          // Access pair properties directly instead of using player1 and player2
          let game = createGame(pair.player1, pair.player2);
          game.playGame();
          pair.winner = game.gameState.winner;
        }
      }

      // moving to the nextround
      let nextRoundPlayers = this.brackets[`round${this.round}`].map((pair) => {
        return { name: pair.winner };
      });
      console.log(this.brackets);
      this.round++;
      if (nextRoundPlayers.length >= 2) {
        this.initializeRound(nextRoundPlayers, this.round);
        this.startTournament(); // Automatically start the next round
      } else if (nextRoundPlayers.length === 1) {
        this.winner = nextRoundPlayers[0]
        console.log(this.winner)
      }
    },
  };
}

let testPlayers = [
  { name: "john" },
  { name: "Vayne" },
  { name: "Jane" },
  { name: "Michael" },
  { name: "Sarah" },
  { name: "William" },
  { name: "Emily" },
  { name: "David" },
];

const testbrackets = createBrackets(...testPlayers);
testbrackets.initializeBrackets();
testbrackets.startTournament();
