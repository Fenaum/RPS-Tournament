import { db } from "../../client/src/ts/firebaseConfig"; // Import the initialized db
import {
  collection,
  doc,
  addDoc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

// Function to create a new player with an auto-generated ID and a createTime
export const createPlayer = async (playerData) => {
  try {
    // Add createTime using serverTimestamp()
    const playerWithTimestamp = {
      ...playerData,
      createTime: serverTimestamp(), // Firestore timestamp
    };
    
    const docRef = await addDoc(collection(db, "players"), playerWithTimestamp); // Auto-generate ID
    console.log("Player created with ID:", docRef.id);
    return docRef.id; // Return the generated player ID for further use
  } catch (error) {
    console.error("Error creating player:", error);
    return null;
  }
};

// Function to get a player
export const getPlayer = async (playerId) => {
  try {
    const playerDoc = await getDoc(doc(db, "players", playerId));
    if (playerDoc.exists()) {
      return playerDoc.data();
    } else {
      console.log("No such player!");
      return null;
    }
  } catch (error) {
    console.error("Error getting player:", error);
    return null;
  }
};


// Function to update a bracket
export const updateTournament = async (bracketId, updatedData) => {
  try {
    await updateDoc(doc(db, "brackets", bracketId), updatedData);
    console.log("Bracket updated:", bracketId);
  } catch (error) {
    console.error("Error updating bracket:", error);
  }
};

// Function to create a new tournament with auto-generated ID
export const createTournament = async (tournamentData) => {
  try {
    const docRef = await addDoc(collection(db, "tournaments"), tournamentData); // Auto-generate ID
    console.log("Tournament created with ID:", docRef.id);
    return docRef.id; // Return the generated tournament ID for further use
  } catch (error) {
    console.error("Error creating tournament:", error);
    return null;
  }
};

createPlayer({name: "Raymond"});