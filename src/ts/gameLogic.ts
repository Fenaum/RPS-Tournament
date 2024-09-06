type PlayerChoice = "rock" | "paper" | "scissors";
type WinningChoices = {
  [key: string]: string;
};

// Define the winning choices
const winningChoices: WinningChoices = {
  rock: "scissors",
  paper: "rock",
  scissors: "paper",
};

// Define the game state
let gameState = {
  player1Score: 0,
  player2Score: 0,
  currentRound: 1,
};

// Function to determine the round result
const startRound = function (
  player1Choice: PlayerChoice,
  player2Choice: PlayerChoice
): string {
  let result: string = "";

  // Check for a tie
  if (player1Choice === player2Choice) {
    result = "tie";
  } else if (winningChoices[player1Choice] === player2Choice) {
    result = "Player 1 wins";
    gameState.player1Score += 1;
  } else {
    result = "Player 2 wins";
    gameState.player2Score += 1;
  }
  gameState.currentRound ++;
  return result;
};

// Function to start the game
const startGame = function () {
  // Initialize or reset game state
  gameState.player1Score = 0;
  gameState.player2Score = 0;
  gameState.currentRound = 1;
};

const playGame = function () {
    startGame(); //initialize the game state
    let player1Choice: PlayerChoice = "rock";
    let player2Choice: PlayerChoice = "paper"

    let result = startRound(player1Choice, player2Choice);
    let winner: string = "";

    // winning condition
    if (gameState.player1Score === 2) {
        winner = "player 1"
    } else if (gameState.player1Score === 2) {
        winner = "player 2";
    }   

    console.log(winner)
}

