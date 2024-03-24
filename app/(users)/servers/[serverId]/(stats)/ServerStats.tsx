import { IServerDoc, IServerJson } from '@/app/_db/models/server.model';
import React from 'react';
import CommandsUsageChart from './CommandsUsageChart';
import HugsChart from './HugsChart';
type ServerStatsProps = {
    guild: GuildObject;
    dbServer: IServerJson;
};

function ServerStats({ guild, dbServer }: ServerStatsProps) {
    return (
        <div className="p-4">
            <CommandsUsageChart guild={guild} />
            <HugsChart guild={guild} />
        </div>
    );
}

export default ServerStats;
