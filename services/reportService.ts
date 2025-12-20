
import { ScreeningResults, FirebaseReport } from '../types';
import { addReport, updateReportStatus } from './firebaseService';

/**
 * Submits a screening report to a specific physician for review via Firebase.
 * @param physicianUsername - The username of the target physician.
 * @param results - The full screening results object.
 * @param aiSummary - The structured AI summary for the physician.
 * @returns The ID of the newly created report in Firestore.
 */
export const submitReportToPhysician = async (physicianUsername: string, results: ScreeningResults, aiSummary: string): Promise<string | null> => {
    if (!results.userId) {
        console.error("Cannot submit report without a userId.");
        return null;
    }

    // The new report object aligns with the Firebase data model
    const newReportPayload = {
        userId: results.userId,
        physicianUsername,
        status: 'pending' as const,
        fullReportData: results,
        aiSummary: aiSummary,
    };
    
    try {
        const reportId = await addReport(newReportPayload);
        return reportId;
    } catch (error) {
        console.error("Failed to submit report to Firestore", error);
        return null;
    }
};

/**
 * Marks a report as 'reviewed' in Firestore.
 * @param reportId - The Firestore document ID of the report to accept.
 */
export const acceptReport = async (reportId: string): Promise<void> => {
    try {
        await updateReportStatus(reportId, 'reviewed');
    } catch (error) {
        console.error(`Failed to accept report ${reportId} in Firestore`, error);
    }
};

// Note: getReports and other localStorage-based functions are now obsolete
// and have been removed. Data fetching is handled directly in components
// with real-time listeners from firebaseService.
