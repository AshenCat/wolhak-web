import dbConnect from '@/app/_lib/dbConnect';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import React from 'react';
import ServerHeader from './ServerHeader';
import { DISCORD_API_BASE_URL, DISCORD_BOT_TOKEN } from '@/app/_lib/config';
import ServerInfo from './(info)/ServerInfo';
import ServerStats from './(stats)/ServerStats';
import ServerManage from './(manage)/ServerManage';
import Server from '@/app/_db/models/server.model';

function getGuildDetails(serverId: string): Promise<GuildObject | null> {
    return new Promise(async (resolve) => {
        try {
            console.log('fetching guild ' + serverId);
            const response = await fetch(
                DISCORD_API_BASE_URL + `/guilds/${serverId}`,
                {
                    headers: {
                        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (!response.ok)
                throw new Error('getGuildDetails Error: ' + response.status);
            const data = response.json();
            resolve(data);
        } catch (err) {
            console.error(err);
            resolve(null);
        }
    });
}

async function ServerId({
    params,
    searchParams,
}: ServerProps<{ serverId: string }>) {
    const session = await auth();

    if (!session) redirect('/');

    await dbConnect();

    const { serverId } = params;

    const [guild, dbServer] = await Promise.all([
        getGuildDetails(params.serverId),
        Server.findOne({ discord_server_id: serverId }),
    ]);

    if (!guild || !dbServer) {
        // throw new Error('INVALID GUILD')
        redirect('/404');
    }

    const { view } = searchParams;

    const { NODE_ENV } = process.env;

    return (
        <>
            <ServerHeader guild={guild} serverId={serverId} />
            {!view && (
                <ServerInfo guild={guild} dbServer={dbServer} ENV={NODE_ENV} />
            )}
            {view === 'stats' && <ServerStats guild={guild} dbServer={dbServer} />}
            {view === 'manage' && <ServerManage guild={guild} dbServer={dbServer} />}
        </>
    );
}

export default ServerId;
