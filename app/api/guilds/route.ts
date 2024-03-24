import { TEMP_DATA } from '@/app/_lib/DISCORD_TEST_DATA';
import { DISCORD_API_BASE_URL, DISCORD_BOT_TOKEN } from '@/app/_lib/config';
import { auth } from '@/auth';
// import { auth } from '@/auth';
// import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        console.log('get guilds api');
        const response = await fetch(
            DISCORD_API_BASE_URL + `/users/@me/guilds`,
            {
                headers: {
                    Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error('Discord response code:' + response.status);
        }

        const data = await response.json();
        // console.log('========================= response.data');
        // console.log(data);
        return NextResponse.json({ data: data }, { status: 200 });
        // return NextResponse.json({ data: TEMP_DATA }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: err }, { status: 500 });
    }
}
