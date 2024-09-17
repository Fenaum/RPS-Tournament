function createGame(player1, player2) {
  return {
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

    startRound: async function() {},
    getPlayerChoices: async function() {}
  };
}
module.exports = { createGame };
