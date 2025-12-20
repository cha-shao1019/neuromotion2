
/**
 * Checks if the user's device has at least one video input device (camera).
 * @returns A promise that resolves to true if a camera is available, false otherwise.
 */
export const hasCamera = async (): Promise<boolean> => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        console.warn("enumerateDevices() not supported.");
        return false;
    }

    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        return devices.some(device => device.kind === 'videoinput');
    } catch (err) {
        console.error("Error enumerating devices:", err);
        return false;
    }
};
