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
    // Initialize 'players' collection
    await setDoc(doc(collection(db, "players"), "player1"), {
      name: "Player 1",
      score: 0,
      createdAt: new Date().toISOString(),
    });

    // Initialize 'brackets' collection
    await setDoc(doc(collection(db, "brackets"), "bracket1"), {
      round: 1,
      players: ["player1"],
      winner: null,
      createdAt: new Date().toISOString(),
    });

    // Initialize 'singleMatches' collection
    await setDoc(doc(collection(db, "singleMatches"), "match1"), {
      player1: "player1",
      player2: "player2", // You can update this dynamically later
      winner: null,
      createdAt: new Date().toISOString(),
    });

    // Initialize 'lobbies' collection
    await setDoc(doc(collection(db, "lobbies"), "lobby1"), {
      players: ["player1"],  // Players currently in this lobby
      maxPlayers: 10,        // Max number of players allowed in this lobby
      status: "waiting",     // Status: 'waiting', 'inProgress', 'finished'
      createdAt: new Date().toISOString(),
    });

    // Initialize 'gameLogs' collection for logging match results
    await setDoc(doc(collection(db, "gameLogs"), "log1"), {
      player1: "player1",
      player2: "player2",
      result: "Player 1 won",
      timestamp: new Date().toISOString(),
    });

    console.log("Collections initialized successfully");
  } catch (error) {
    console.error("Error initializing collections: ", error);
  }
};

export { db }

// Call initialization function
initializeCollections();
