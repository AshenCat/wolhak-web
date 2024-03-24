import { IServerDoc } from '@/app/_db/models/server.model';
import { getServerImage } from '@/app/_lib/util/client-utils';
import { useGuildStore } from '@/app/_lib/store/discord/guild.store';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import Loading from '@/app/_components/loading/Loading';

type ServerItemProps = {
    server: IServerDoc;
    filterString: string;
};

function ServerItem({ server, filterString }: ServerItemProps) {
    const { guilds, isFetchingGuilds } = useGuildStore((state) => state);
    const currentGuild = guilds[server.discord_server_id];
    const pathname = usePathname();

    if (
        (filterString || filterString !== '') &&
        !(
            currentGuild.name
                .toLowerCase()
                .includes(filterString.toLowerCase()) ||
            currentGuild.id.includes(filterString)
        )
    )
        return <></>;

    if (isFetchingGuilds)
        return (
            <Loading>Processing Guild ID {server.discord_server_id}...</Loading>
        );
    if (!currentGuild)
        return (
            <div className="">
                failed to fetch data of Guild ID {server.discord_server_id}
            </div>
        );
    return (
        <Link
            href={`${pathname}/${currentGuild.id}`}
            className="flex border-2 p-2 items-center w-full lg:max-w-sm"
        >
            <div className=" flex-shrink-0">
                <Image
                    width={70}
                    height={70}
                    alt={`${currentGuild.name} thumbnail`}
                    src={getServerImage(currentGuild.id, currentGuild.icon)}
                    className="rounded-sm"
                />
            </div>
            <div className="px-2 h-full max-w-full grow min-w-0">
                <h3 className="text-2xl text-ellipsis overflow-hidden whitespace-nowrap">
                    {currentGuild.name}
                </h3>
            </div>
        </Link>
    );
}

export default ServerItem;
