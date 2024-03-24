import { IServerJson } from '@/app/_db/models/server.model';
import React from 'react';

type ServerManageProps = {
    guild: GuildObject;
    dbServer: IServerJson;
};

function ServerManage({ guild, dbServer }: ServerManageProps) {
    return <div>ServerManage</div>;
}

export default ServerManage;
