'use client';
import { colorIntegerToHex, getServerEmoji } from '@/app/_lib/util/client-utils';
import Image from 'next/image';
import React, { useState } from 'react';

const RoleEmojiView = ({
    roles,
    emojis,
    ENV,
    adminRoleIds,
}: {
    roles: GuildObject['roles'];
    emojis: GuildObject['emojis'];
    ENV: 'development' | 'production' | 'test';
    adminRoleIds: string[];
}) => {
    const [tab, setTab] = useState<'ROLES' | 'EMOJIS'>('ROLES');

    return (
        <div className="flex flex-col md:flex-row">
            <div className="flex md:flex-col shrink-0 [&>*]:p-2 [&>*]:border-2 gap-2">
                {roles && (
                    <button className="" onClick={() => setTab('ROLES')}>
                        Roles: {roles.length}
                    </button>
                )}
                {emojis && (
                    <button className="" onClick={() => setTab('EMOJIS')}>
                        Emojis: {emojis.length}
                    </button>
                )}
            </div>
            <div className="flex gap-4 flex-wrap p-2 border-2">
                {tab === 'ROLES' &&
                    roles.length &&
                    roles.map((role) => (
                        <div
                            key={role.id}
                            className="p-2 rounded-sm relative"
                            style={{
                                backgroundColor: `#${colorIntegerToHex(
                                    role.color
                                )}`,
                            }}
                        >
                            {adminRoleIds?.includes(role.id) && (
                                <small className="absolute top-[-12px] right-[-8px] bg-zinc-400 py-1 px-2 rounded-xl">
                                    Admin
                                </small>
                            )}
                            <span className="text-white mix-blend-difference">
                                {role.name}
                            </span>
                        </div>
                    ))}
                {tab === 'EMOJIS' &&
                    emojis.length &&
                    emojis.map((emoji) => (
                        <div
                            key={emoji.id}
                            className="flex flex-col justify-center items-center"
                        >
                            {ENV !== 'production' && (
                                <span>
                                    <Image
                                        width={50}
                                        height={50}
                                        src={getServerEmoji(
                                            emoji.id,
                                            emoji.animated
                                        )}
                                        alt={emoji.name}
                                    />
                                </span>
                            )}
                            <span>{emoji.name}</span>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default RoleEmojiView;
