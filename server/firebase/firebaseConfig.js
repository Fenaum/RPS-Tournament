const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
} = require("firebase/firestore");

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

// Function to reset collections
const resetCollections = async (collectionNames) => {
  try {
    for (const name of collectionNames) {
      const querySnapshot = await getDocs(collection(db, name));
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
      console.log(`${name} collection has been reset`);
    }
  } catch (error) {
    console.error("Error resetting collections: ", error);
  }
};

// Function to initialize collections
const initializeCollections = async () => {
  try {
    // Reset collections before initializing new ones
    await resetCollections([
      "players",
      "tournaments",
      "singleMatches",
      "lobby",
      "gameLogs",
    ]);

    // Initialize 'players' collection with a unique ID
    const playerRef1 = doc(collection(db, "players"));
    const playerRef2 = doc(collection(db, "players"));
    const playerRef3 = doc(collection(db, "players"));
    const playerRef4 = doc(collection(db, "players"));
    await setDoc(playerRef1, {
      username: "Player 1",
      score: 0,
      createdAt: new Date().toISOString(),
    });

    await setDoc(playerRef2, {
      username: "Player 2",
      score: 0,
      createdAt: new Date().toISOString(),
    });

    await setDoc(playerRef3, {
      username: "Player 3",
      score: 0,
      createdAt: new Date().toISOString(),
    });

    await setDoc(playerRef4, {
      username: "Player 4",
      score: 0,
      createdAt: new Date().toISOString(),
    });

    // Initialize 'brackets' collection with a unique ID
    const tournamentRef = doc(collection(db, "tournaments"));
    await setDoc(tournamentRef, {
      round: 0,
      players: [playerRef1.id, playerRef2.id, playerRef3.id, playerRef4.id], // Use the generated player ID
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
    const lobbyRef = doc(collection(db, "lobby"));
    await setDoc(lobbyRef, {
      roomName: 'test',
      players: [i.id], // Players currently in this lobby
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

// initializeCollections();

return { db };
