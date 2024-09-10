import { createGame } from "./gameLogic";

export function createBrackets(...players: any) {
  return {
    brackets: {} as { [key: string]: any[] },
    roundth: 1 as number, // start with round 1
    initializeBrackets: function () {
      if (players.length % 4 === 0) {
        this.brackets[`round${this.roundth}`] = [];

        for (let i = 0; i < players.length; i += 2) {
          let player1 = players[i];
          let player2 = players[i + 1];
          this.brackets[`round${this.roundth}`].push({
            player1,
            player2,
            winner: "",
          });
        }
      } else {
        console.log("Not enough players");
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
          console.log(this.brackets)
        }
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
