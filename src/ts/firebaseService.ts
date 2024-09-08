import { db } from "./firebaseConfig"; // Import the initialized db
import { collection, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

// Function to create a new player
export const createPlayer = async (playerId: string, playerData: any) => {
  try {
    await setDoc(doc(collection(db, "players"), playerId), playerData);
    console.log("Player created:", playerId);
  } catch (error) {
    console.error("Error creating player:", error);
  }
};

// Function to get a player
export const getPlayer = async (playerId: string) => {
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

// Function to update bracket
export const updateBracket = async (bracketId: string, updatedData: any) => {
  try {
    await updateDoc(doc(db, "brackets", bracketId), updatedData);
    console.log("Bracket updated:", bracketId);
  } catch (error) {
    console.error("Error updating bracket:", error);
  }
};

// You can add more functions as needed, following the same structure
