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

let choices: PlayerChoice[] = ["rock", "paper", "scissors"];

// Define the game state
let gameState = {
  player1Score: 0,
  player2Score: 0,
  currentRound: 1,
};

// Function to determine the round result
const startRound = function () {
  let result: string = "";
  let player1Choice = choices[Math.floor(Math.random() * 3)];
  let player2Choice = choices[Math.floor(Math.random() * 3)];

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
  gameState.currentRound++;
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

  // winning condition
  while (Math.abs(gameState.player1Score - gameState.player2Score) < 2) {
    let result = startRound();
    let winner: string = "";
    console.log(result);
  }

  console.log(gameState);
};

playGame();
