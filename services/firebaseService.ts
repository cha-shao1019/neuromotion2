import { initializeApp } from 'firebase/app';
import { 
    getFirestore, 
    collection, 
    addDoc, 
    serverTimestamp, 
    query, 
    where, 
    onSnapshot, 
    orderBy,
    doc,
    updateDoc
} from 'firebase/firestore';
import { FirebaseReport } from '../types';

// Use environment variables for Firebase configuration for security and flexibility.
// FIX: Switched from import.meta.env to process.env to resolve TypeScript errors.
// These variables are defined in vite.config.ts for client-side availability.
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const REPORTS_COLLECTION = 'medical_reports';

/**
 * Adds a new report to the Firestore database.
 * @param reportPayload - The report data to add, without the server-generated fields.
 * @returns The ID of the newly created document.
 */
export const addReport = async (reportPayload: Omit<FirebaseReport, 'id' | 'timestamp'>): Promise<string> => {
    const docRef = await addDoc(collection(db, REPORTS_COLLECTION), {
        ...reportPayload,
        timestamp: serverTimestamp()
    });
    return docRef.id;
};

/**
 * Updates the status of a specific report.
 * @param reportId - The ID of the report document to update.
 * @param status - The new status to set ('pending' or 'reviewed').
 */
export const updateReportStatus = async (reportId: string, status: 'pending' | 'reviewed'): Promise<void> => {
    const reportRef = doc(db, REPORTS_COLLECTION, reportId);
    await updateDoc(reportRef, { status });
};

/**
 * Sets up a real-time listener for new pending reports for a specific physician.
 * @param physicianUsername - The username of the physician to listen for.
 * @param callback - A function to be called with the array of new reports.
 * @returns An unsubscribe function to stop the listener.
 */
export const onNewReports = (physicianUsername: string, callback: (reports: FirebaseReport[]) => void): (() => void) => {
    const q = query(
        collection(db, REPORTS_COLLECTION), 
        where("physicianUsername", "==", physicianUsername),
        where("status", "==", "pending"),
        orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const reports: FirebaseReport[] = [];
        querySnapshot.forEach((doc) => {
            reports.push({ id: doc.id, ...doc.data() } as FirebaseReport);
        });
        callback(reports);
    }, (error) => {
        console.error("Error listening to new reports:", error);
    });

    return unsubscribe;
};