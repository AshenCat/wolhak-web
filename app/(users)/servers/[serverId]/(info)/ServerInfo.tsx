import React from 'react';
import RoleEmojiView from './RoleEmojiView';
import { IServerDoc } from '@/app/_db/models/server.model';

type ServerInfoProps = {
    guild: GuildObject;
    dbServer: IServerDoc;
    ENV: 'development' | 'production' | 'test';
};

function ServerInfo({ guild, dbServer, ENV }: ServerInfoProps) {
    const {
        id,
        name,
        description,
        emojis,
        banner,
        owner_id,
        region,
        roles,
        approximate_member_count,
    } = guild;
    return (
        <div className="p-4">
            {description && <div className="">{description}</div>}
            {approximate_member_count && (
                <div>Member count: {approximate_member_count}</div>
            )}
            <RoleEmojiView adminRoleIds={dbServer.admin_role_ids} roles={roles} emojis={emojis} ENV={ENV} />
        </div>
    );
}

export default ServerInfo;
