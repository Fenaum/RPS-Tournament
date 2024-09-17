const { createGame } = require("./gameLogic");

function createSingleMatch(socket, player1, player2) {
  return {
    round: 1,
    winner: null,

    // Initialize players into the match
    async initializeMatch() {
      // Create a new game instance
      const game = createGame(player1, player2);

      // Start the game
      game.startGame();

      // Simulate game rounds
      while (
        Math.abs(game.gameState.player1Score - game.gameState.player2Score) < 2
      ) {
        // Here you might want to handle player moves or simulate them
        // For now, we are just simulating rounds
        let result = game.startRound();
        console.log(result); // Logging the result of each round
        // You can emit the game state to the client if needed
        socket.emit("gameUpdate", { result, gameState: game.gameState });
        // You might also want to add a delay between rounds if simulating real-time
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
      }

      // Determine the final winner
      this.winner = game.gameState.winner;
      console.log(`Match Winner: ${this.winner}`);
      // Emit the final result to the client
      socket.emit("matchEnd", { winner: this.winner });
    },
  };
}

module.exports = { createSingleMatch };
