import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Firestore instance connected to custom database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");

export const FIREBASE_PROJECT_ID = firebaseConfig.projectId;
export const FIRESTORE_DATABASE_ID = firebaseConfig.firestoreDatabaseId;
export const FIRESTORE_CONSOLE_URL = `https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore/databases/${firebaseConfig.firestoreDatabaseId}/data`;

// Validate Firestore server connection
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, "medicines", "test-connection"));
    return true;
  } catch (error: any) {
    // If permission or document not found, it still reached the server
    if (error?.code === "unavailable" || error?.message?.includes("client is offline")) {
      console.warn("Firestore connection check: client offline or unavailable", error);
      return false;
    }
    return true;
  }
}
