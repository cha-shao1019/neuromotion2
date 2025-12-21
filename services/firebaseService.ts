
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

// Cast import.meta to any to resolve TS errors regarding .env property in Vite environment
const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY,
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const REPORTS_COLLECTION = 'medical_reports';

export const addReport = async (reportPayload: Omit<FirebaseReport, 'id' | 'timestamp'>): Promise<string> => {
    const docRef = await addDoc(collection(db, REPORTS_COLLECTION), {
        ...reportPayload,
        timestamp: serverTimestamp()
    });
    return docRef.id;
};

export const updateReportStatus = async (reportId: string, status: 'pending' | 'reviewed'): Promise<void> => {
    const reportRef = doc(db, REPORTS_COLLECTION, reportId);
    await updateDoc(reportRef, { status });
};

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
        console.error("Firebase Sync Error:", error);
    });

    return unsubscribe;
};
