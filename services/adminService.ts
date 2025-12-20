import { AdminUser } from '../types';

const ADMIN_STORAGE_KEY = 'parkinson_admins';

/**
 * Retrieves the map of admin users from localStorage.
 * @returns A record object of admin users.
 */
export const getAdmins = (): Record<string, AdminUser> => {
    try {
        const storedAdmins = localStorage.getItem(ADMIN_STORAGE_KEY);
        return storedAdmins ? JSON.parse(storedAdmins) : {};
    } catch (error) {
        console.error("Failed to parse admins from localStorage", error);
        return {};
    }
};

/**
 * Saves the map of admin users to localStorage.
 * @param admins - The record object of admin users to save.
 */
const saveAdmins = (admins: Record<string, AdminUser>): void => {
    try {
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(admins));
    } catch (error) {
        console.error("Failed to save admins to localStorage", error);
    }
};

/**
 * Registers a new admin user. The first user is automatically approved as super-admin,
 * subsequent users are set to 'pending'.
 * @param username - The username for the new admin.
 * @param password - The password for the new admin.
 * @param proof - The proof of identity provided by the user.
 * @param role - The selected role ('admin' or 'physician').
 * @param googleAccount - The physician's Google account email.
 * @returns The status of the new user ('approved' or 'pending').
 */
export const registerAdmin = (username: string, password: string, proof: string, role: 'admin' | 'physician', googleAccount?: string): 'approved' | 'pending' => {
    const admins = getAdmins();
    const isFirstAdmin = Object.keys(admins).length === 0;
    
    const newUser: AdminUser = {
        password,
        status: isFirstAdmin ? 'approved' : 'pending',
        role: isFirstAdmin ? 'super-admin' : role,
        proof,
        googleAccount: role === 'physician' ? googleAccount : undefined,
    };

    admins[username] = newUser;
    saveAdmins(admins);
    
    return newUser.status;
};

/**
 * Approves a pending admin user.
 * @param username - The username of the admin to approve.
 */
export const approveAdmin = (username: string): void => {
    const admins = getAdmins();
    if (admins[username] && admins[username].status === 'pending') {
        admins[username].status = 'approved';
        saveAdmins(admins);
    }
};

/**
 * Revokes an approved user's access, setting their status back to 'pending'.
 * @param username The username of the user to revoke.
 */
export const revokeApproval = (username: string): void => {
    const admins = getAdmins();
    if (admins[username] && admins[username].status === 'approved' && admins[username].role !== 'super-admin') {
        admins[username].status = 'pending';
        saveAdmins(admins);
    }
};

/**
 * Deletes a user account, as long as they are not a super-admin.
 * @param username The username of the user to delete.
 */
export const deleteUser = (username: string): void => {
    const admins = getAdmins();
    if (admins[username] && admins[username].role !== 'super-admin') {
        delete admins[username];
        saveAdmins(admins);
    }
};


/**
 * Disapproves and deletes a pending admin user.
 * @param username - The username of the admin to disapprove.
 */
export const disapproveAdmin = (username: string): void => {
    const admins = getAdmins();
    if (admins[username] && admins[username].status === 'pending') {
        delete admins[username];
        saveAdmins(admins);
    }
};

/**
 * Retrieves a list of all approved physicians.
 * @returns An array of approved physician users (without password).
 */
export const getApprovedPhysicians = (): (Omit<AdminUser, 'password'> & { username: string })[] => {
    const admins = getAdmins();
    return Object.entries(admins)
        .filter(([, user]) => user.status === 'approved' && user.role === 'physician')
        .map(([username, user]) => ({
            username,
            status: user.status,
            role: user.role,
            proof: user.proof,
        }));
};