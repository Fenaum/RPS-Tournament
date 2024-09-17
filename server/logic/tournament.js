// const { createGame } = require("./gameLogic");

// function createTournament(socket, ...players) {
//   return {
//     brackets: {},
//     round: 1,
//     winner: null,

//     // Ensure the player count is 8 or 16
//     async initializeBrackets() {
//       const maxPlayers = players.length <= 8 ? 8 : 16;

//       if (players.length > maxPlayers) {
//         console.log(
//           `Tournament can only have ${maxPlayers} players. Limiting to the first ${maxPlayers}.`
//         );
//         players = players.slice(0, maxPlayers); // Trim excess players
//       } else {
//         while (players.length < maxPlayers) {
//           players.push({ username: "Bot" + (players.length + 1) }); // Add bots if needed
//         }
//       }

//       await this.initializeRound(players, this.round);
//     },

//     async initializeRound(roundPlayers, roundNumber) {
//       this.brackets[`round${roundNumber}`] = [];
//       for (let i = 0; i < roundPlayers.length; i += 2) {
//         let player1 = roundPlayers[i];
//         let player2 = roundPlayers[i + 1];
//         this.brackets[`round${roundNumber}`].push({
//           player1,
//           player2,
//           winner: "",
//         });
//       }

//       // Emit event to inform players that a new round is starting
//       socket.emit("roundStart", {
//         round: roundNumber,
//         pairs: this.brackets[`round${roundNumber}`],
//       });
//     },

//     async startTournament() {
//       for (let round in this.brackets) {
//         for (let pair of this.brackets[round]) {
//           let game = createGame(pair.player1, pair.player2);

//           // Emit event to ask players for their moves
//           socket.emit("gameStart", {
//             player1: pair.player1,
//             player2: pair.player2,
//           });

//           // Wait for players' input via socket
//           let result = await new Promise((resolve) => {
//             socket.on("playerMove", (moveData) => {
//               // Simulate gameplay based on the moveData received
//               game.playGame(moveData);
//               resolve(game.gameState.winner);
//             });
//           });

//           pair.winner = result;
//         }
//       }

//       let nextRoundPlayers = this.brackets[`round${this.round}`].map((pair) => {
//         return { username: pair.winner };
//       });

//       console.log(this.brackets);
//       this.round++;

//       if (nextRoundPlayers.length >= 2) {
//         await this.initializeRound(nextRoundPlayers, this.round);
//         await this.startTournament();
//       } else if (nextRoundPlayers.length === 1) {
//         this.winner = nextRoundPlayers[0];
//         console.log("Tournament Winner: ", this.winner);

//         // Emit the winner to all players
//         socket.emit("tournamentWinner", { winner: this.winner });
//       }
//     },
//   };
// }

// // Example Usage
// let testPlayers = [
//   { username: "john" },
//   { username: "Vayne" },
//   { username: "Jane" },
//   { username: "Michael" },
//   { username: "Sarah" },
//   { username: "William" },
//   { username: "Emily" },
// ];

// // Example Socket.IO server-side setup
// const io = require("socket.io")(3000); // Start Socket.IO server on port 3000

// io.on("connection", (socket) => {
//   console.log("A player connected");

//   const testTournament = createTournament(socket, ...testPlayers);
//   testTournament.initializeBrackets();
//   testTournament.startTournament();
// });
