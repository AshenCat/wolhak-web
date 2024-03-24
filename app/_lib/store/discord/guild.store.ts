'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IGuildState {
    guilds: { [key: string]: GuildPartials };
    isFetchingGuilds: boolean;
    setGuilds: (serversJoinedByUser: GuildPartials[]) => void;
    setIsFetchingGuilds: (value: boolean) => void;
    expiry: Date | undefined;
}

export const useGuildStore = create<IGuildState>()(
    persist(
        (set, get) => ({
            guilds: {},
            isFetchingGuilds: false,
            setGuilds: async (serversJoinedByUser) => {
                set(() => {
                    console.log('serversJoinedByUser');
                    console.log(serversJoinedByUser);
                    return {
                        guilds: serversJoinedByUser.reduce<{
                            [key: string]: GuildPartials;
                        }>((acc, guild) => ({ ...acc, [guild.id]: guild }), {}),
                    };
                });
                const date = new Date();
                date.setMinutes(date.getMinutes() + 1);
                set(() => ({ expiry: date }));
            },
            setIsFetchingGuilds: (value) => {
                set(() => ({ isFetchingGuilds: value }));
            },
            expiry: undefined,
        }),
        { name: 'whs-guild-store' }
    )
);
