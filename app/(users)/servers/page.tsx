import Server, { IServerDoc } from '@/app/_db/models/server.model';
import dbConnect from '@/app/_lib/dbConnect';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ServerList from './ServerList';
import { isSuperAdmin } from '@/app/_lib/util/server-util';

export default async function Dashboard() {
    const session = await auth();

    if (!session) redirect('/');

    await dbConnect();

    let filter: { [key: string]: string } = {
        owner_email: session.user.email,
    };

    if (isSuperAdmin(session.user?.id, session.user?.email)) {
        filter = {};
    }

    const servers = await Server.find(filter).lean();

    const serverList = JSON.parse(JSON.stringify(servers)) as IServerDoc[];

    // rendering components for not logged in users
    return (
        <div className="p-4">
            <ServerList serverList={serverList} />
        </div>
    );
}
