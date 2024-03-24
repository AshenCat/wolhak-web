import NextAuth, { NextAuthConfig } from 'next-auth';
import Discord from 'next-auth/providers/discord';
import { AUTH_DISCORD_ID, AUTH_DISCORD_SECRET } from './app/_lib/config';

const scopes = ['identify', 'email', 'guilds', 'gdm.join'].join(' ');

const config = {
    providers: [
        Discord({
            clientId: AUTH_DISCORD_ID,
            clientSecret: AUTH_DISCORD_SECRET,
            // authorization: "https://discord.com/api/oauth2/authorize?scope=identify+guilds+guilds.members.read+email",
        }),
    ],
    callbacks: {
        async session({ session, token, user }) {
            if (token) {
                session.user.id = token.discord_id;
            }
            session.accessToken = token.accessToken;
            return session;
        },
        async jwt({ token, account }) {
            if (account) {
                console.log('account');
                console.log(account);
                token.accessToken = account.access_token;
                token.discord_id = account.providerAccountId;
            }
            return token;
        },
    },
    session: {
        strategy: 'jwt',
    },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
