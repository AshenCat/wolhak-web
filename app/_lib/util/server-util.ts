import { DISCORD_SUPER_ADMIN_EMAILS, DISCORD_SUPER_ADMIN_IDS } from '../config';

export const isSuperAdmin = (userId?: string, email?: string) => {
    if (!userId || !email) {
        throw new Error('INVALID USER SESSION!');
    }
    return (
        DISCORD_SUPER_ADMIN_EMAILS.includes(email) ||
        DISCORD_SUPER_ADMIN_IDS.includes(userId)
    );
};
