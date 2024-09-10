import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCeuR0GdCDVlWG9tbqqde8UFydxLg0FNSo",
  authDomain: "rps-tournament-81fef.firebaseapp.com",
  databaseURL: "https://rps-tournament-81fef-default-rtdb.firebaseio.com",
  projectId: "rps-tournament-81fef",
  storageBucket: "rps-tournament-81fef.appspot.com",
  messagingSenderId: "785941536207",
  appId: "1:785941536207:web:6958824621716fb1a886ba",
  measurementId: "G-PLEQDH1F7R",
};

initializeApp(firebaseConfig);
const db = getFirestore();

const initializeCollections = async () => {
  try {
    // Initialize 'players' collection with a unique ID
    const playerRef = doc(collection(db, "players"));
    await setDoc(playerRef, {
      name: "Player 1",
      score: 0,
      createdAt: new Date().toISOString(),
    });

    // Initialize 'brackets' collection with a unique ID
    const bracketRef = doc(collection(db, "brackets")); //change to bracketsgroup
    await setDoc(bracketRef, {
      round: 1,
      players: [playerRef.id], // Use the generated player ID
      winner: null,
      createdAt: new Date().toISOString(),
    });

    // Initialize 'singleMatches' collection with a unique ID
    const matchRef = doc(collection(db, "singleMatches"));
    await setDoc(matchRef, {
      player1: playerRef.id,
      player2: "player2", // You can update this dynamically later
      winner: null,
      createdAt: new Date().toISOString(),
    });

    // Initialize 'lobbies' collection with a unique ID
    const lobbyRef = doc(collection(db, "lobbies"));
    await setDoc(lobbyRef, {
      players: [playerRef.id], // Players currently in this lobby
      maxPlayers: 50, // Max number of players allowed in this lobby
      status: "waiting", // Status: 'waiting', 'inProgress', 'finished'
      createdAt: new Date().toISOString(),
    });

    // Initialize 'gameLogs' collection for logging match results with a unique ID
    const logRef = doc(collection(db, "gameLogs"));
    await setDoc(logRef, {
      player1: playerRef.id,
      player2: "player2",
      result: "Player 1 won",
      timestamp: new Date().toISOString(),
    });

    console.log("Collections initialized successfully with unique IDs");
  } catch (error) {
    console.error("Error initializing collections: ", error);
  }
};

export { db };

// Call initialization function
initializeCollections();
