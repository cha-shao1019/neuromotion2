
import { ScreeningResults, AdminData, ChartDataPoint, PatientReportRequest } from '../types';

const REPORTS_STORAGE_KEY = 'neuromotion_reports'; // For aggregate data
const PENDING_REPORTS_STORAGE_KEY = 'neuromotion_pending_reports'; // For individual physician submissions

// A simple function to determine risk level from results
const determineMotorTestResult = (fingerTapResult: ScreeningResults['fingerTapResult'], maskedFaceResult: ScreeningResults['maskedFaceResult']): 'Normal' | 'Slight Risk' | 'Moderate Risk' | 'High Risk' => {
    let riskPoints = 0;
    if (fingerTapResult) {
        if (fingerTapResult.fingerTapping?.speed === 'slow') riskPoints += 1;
        if (fingerTapResult.fingerTapping?.consistency !== 'consistent') riskPoints += 1;
        if (fingerTapResult.staticTremor?.tremorFrequency && fingerTapResult.staticTremor.tremorFrequency > 3) riskPoints += 2;
    }
    if (maskedFaceResult) {
        if (maskedFaceResult.expressionMatch === 'poor') riskPoints += 2;
        if (maskedFaceResult.reactionTime === 'slow') riskPoints += 1;
    }

    if (riskPoints >= 4) return 'High Risk';
    if (riskPoints >= 2) return 'Moderate Risk';
    if (riskPoints > 0) return 'Slight Risk';
    return 'Normal';
};

/**
 * Saves the report to the main aggregate pool.
 */
export const saveReport = (results: ScreeningResults, realData?: { frequency: ChartDataPoint[], amplitude: ChartDataPoint[] }): void => {
     if (!results.userId) {
        console.error("Cannot save report without a userId.");
        return;
    }
     const newReport: AdminData = {
        userId: results.userId,
        date: new Date().toISOString(),
        questionnaireScore: results.questionnaireScore || 0,
        motorTestResult: determineMotorTestResult(results.fingerTapResult, results.maskedFaceResult),
        age: results.age || 'N/A',
        gender: (results.gender as AdminData['gender']) || 'N/A',
        realData: realData,
    };
     try {
        const existingReports = getReports();
        if (existingReports.some(report => report.userId === newReport.userId)) return;
        const updatedReports = [...existingReports, newReport];
        localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updatedReports));
    } catch (error) {
        console.error("Failed to save aggregate report to localStorage", error);
    }
};


/**
 * Submits a screening report to a specific physician for review.
 * @param physicianUsername - The username of the target physician.
 * @param results - The full screening results object.
 * @param realData - Optional detailed chart data.
 */
export const submitReportToPhysician = (physicianUsername: string, results: ScreeningResults, realData?: { frequency: ChartDataPoint[], amplitude: ChartDataPoint[] }): void => {
    if (!results.userId) {
        console.error("Cannot submit report without a userId.");
        return;
    }

    const newRequest: PatientReportRequest = {
        reportId: `rep_${Date.now()}`,
        patientUserId: results.userId,
        physicianUsername,
        status: 'pending',
        date: new Date().toISOString(),
        fullReportData: results,
        realData,
    };
    
    try {
        const existingRequests = getPendingReports();
        const updatedRequests = [...existingRequests, newRequest];
        localStorage.setItem(PENDING_REPORTS_STORAGE_KEY, JSON.stringify(updatedRequests));
    } catch (error) {
        console.error("Failed to submit report to physician", error);
    }
};

/**
 * Retrieves all pending reports from localStorage.
 */
const getPendingReports = (): PatientReportRequest[] => {
    try {
        const stored = localStorage.getItem(PENDING_REPORTS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error("Failed to parse pending reports", error);
        return [];
    }
};

/**
 * Retrieves all pending reports for a specific physician.
 * @param physicianUsername - The username of the physician.
 * @returns An array of pending report requests.
 */
export const getPendingReportsForPhysician = (physicianUsername: string): PatientReportRequest[] => {
    const allPending = getPendingReports();
    return allPending
        .filter(req => req.physicianUsername === physicianUsername && req.status === 'pending')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

/**
 * Marks a report as accepted by the physician and adds it to the aggregate data pool.
 * @param reportId - The ID of the report to accept.
 */
export const acceptReport = (reportId: string): void => {
    const allPending = getPendingReports();
    const reportIndex = allPending.findIndex(req => req.reportId === reportId);

    if (reportIndex > -1) {
        const acceptedReport = allPending[reportIndex];
        acceptedReport.status = 'accepted';
        
        // Save to aggregate pool upon acceptance
        saveReport(acceptedReport.fullReportData, acceptedReport.realData);

        // Update the status in the pending list (or remove it)
        allPending[reportIndex] = acceptedReport;
        localStorage.setItem(PENDING_REPORTS_STORAGE_KEY, JSON.stringify(allPending));
    }
};

/**
 * Retrieves all saved reports for the aggregate dashboard view.
 */
export const getReports = (): AdminData[] => {
    try {
        const storedReports = localStorage.getItem(REPORTS_STORAGE_KEY);
        const reports: AdminData[] = storedReports ? JSON.parse(storedReports) : [];
        return reports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
        console.error("Failed to parse reports from localStorage", error);
        return [];
    }
};