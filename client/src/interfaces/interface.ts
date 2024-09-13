// src/interfaces/tournament.ts

export interface Player {
  name: string;
}

export interface Match {
  player1: Player;
  player2: Player;
  winner: string; // or Player if needed
}

export interface Tournament {
  brackets: {
    [round: string]: Match[];
  };
  round: number;
  winner: Player | null;
}
