export const DB_USER = process.env.DB_USER || false;
export const DB_PASS = process.env.DB_PASS || false;
export const DB_LOCAL_URI = process.env.DB_LOCAL_URI || false;
export const DB_REMOTE_URI = process.env.DB_REMOTE_URI || false;

export const AUTH_DISCORD_ID = (() => {
    if (process.env.AUTH_DISCORD_ID && process.env.AUTH_DISCORD_ID !== '') {
        return process.env.AUTH_DISCORD_ID;
    } else throw new Error('AUTH_DISCORD_ID IS NOT SET');
})();

export const AUTH_DISCORD_SECRET = (() => {
    if (
        process.env.AUTH_DISCORD_SECRET &&
        process.env.AUTH_DISCORD_SECRET !== ''
    ) {
        return process.env.AUTH_DISCORD_SECRET;
    } else throw new Error('AUTH_DISCORD_SECRET IS NOT SET');
})();

export const DISCORD_BOT_TOKEN = (() => {
    if (process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_BOT_TOKEN !== '') {
        return process.env.DISCORD_BOT_TOKEN;
    } else throw new Error('DISCORD_BOT_TOKEN IS NOT SET');
})();

export const DISCORD_SUPER_ADMIN_IDS = (() => {
    if (process.env.DISCORD_SUPER_ADMIN_IDS) {
        return process.env.DISCORD_SUPER_ADMIN_IDS.split(',');
    } else throw new Error('DISCORD_SUPER_ADMIN_IDS IS NOT SET');
})();
export const DISCORD_SUPER_ADMIN_EMAILS = (() => {
    if (process.env.DISCORD_SUPER_ADMIN_EMAILS) {
        return process.env.DISCORD_SUPER_ADMIN_EMAILS.split(',');
    } else throw new Error('DISCORD_SUPER_ADMIN_EMAILS IS NOT SET');
})();

export const DISCORD_API_BASE_URL = 'https://discord.com/api/v10';
