'use client';

import { IServerDoc } from '@/app/_db/models/server.model';
import { useGuildStore } from '@/app/_lib/store/discord/guild.store';
import React, { useEffect, useState } from 'react';
import ServerItem from './ServerItem';
import { useSession } from 'next-auth/react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { IoReload } from 'react-icons/io5';

function ServerList({ serverList }: { serverList: IServerDoc[] }) {
    const session = useSession();
    const { guilds, expiry, setGuilds, setIsFetchingGuilds } = useGuildStore(
        (state) => state
    );

    const [filterString, setFilterString] = useState('');

    useEffect(() => {
        async function getServersJoinedByUser() {
            console.log('fetching discord guilds');
            setIsFetchingGuilds(true);
            const response = await fetch('/api/guilds', {
                method: 'GET',
                cache: 'no-cache',
            });
            if (response.ok) {
                console.log('successfully fetched discord guilds');
                const { data } = await response.json();
                setGuilds(data as GuildPartials[]);
            }
            setIsFetchingGuilds(false);
        }

        if (session.data?.accessToken) {
            if (!expiry || (expiry && expiry > new Date())) {
                getServersJoinedByUser();
            }
        }
    }, [
        session.data?.accessToken,
        setGuilds,
        setIsFetchingGuilds,
        guilds,
        expiry,
    ]);

    return (
        <div className="flex flex-col gap-2 p-2 w-fit mx-auto min-w-[370px]">
            <div className="flex justify-between items-center">
                <div>Servers</div>

                <button>
                    <IoReload />
                </button>
            </div>
            <div className="w-full">
                <div className="p-2 flex w-full items-center bg-gray-400 rounded-sm">
                    <input
                        type="text"
                        className="grow min-w-0 mr-1"
                        onChange={(e) => setFilterString(e.target.value)}
                    />
                    <FaMagnifyingGlass />
                </div>
            </div>
            {serverList.length > 0 &&
                serverList.map((server, index) => (
                    <ServerItem
                        key={`serverList-${index}-${server.id}`}
                        filterString={filterString}
                        server={server}
                    />
                ))}
            {serverList.length === 0 && (
                <div className="max-w-[370px]">
                    It looks like you are not a registered admin for any guilds
                    that Wolhak is a part of. Please contact us if you have
                    further questions.
                </div>
            )}
        </div>
    );
}

export default ServerList;
