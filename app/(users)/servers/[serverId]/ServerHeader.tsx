import { getServerImage } from '@/app/_lib/util/client-utils';
import Image from 'next/image';
import React from 'react';
import ServerHeaderNavButtons from './ServerHeaderNavButtons';

type ServerHeaderProps = {
    guild: GuildObject;
    serverId: string;
};

function ServerHeader({ guild, serverId }: ServerHeaderProps) {
    return (
        <div className="p-4 relative">
            <div className="" id="banner"></div>
            <div className="flex">
                <div className="flexjustify-center shrink-0 w-[100px] sm:w-[150px] h-[100px] sm:h-[150px] relative">
                    <Image
                        alt={`${guild.name} thumbnail`}
                        src={getServerImage(guild.id, guild.icon)}
                        className="rounded-sm"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
                <div className="flex flex-col pl-2 sm:pl-8">
                    <h3 className="text-2xl sm:text-4xl mt-auto">
                        {guild.name}
                    </h3>
                    <span className="text-sm sm:text-lg">({guild.id})</span>
                </div>
            </div>
            <ServerHeaderNavButtons serverId={serverId} />
        </div>
    );
}

export default ServerHeader;
