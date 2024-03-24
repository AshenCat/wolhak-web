'use client';
import { useMediaQuery } from '@/app/_components/hooks/useMediaQuery';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

type ServerHeaderNavButtonsProps = {
    serverId: string;
};

function ServerHeaderNavButtons({ serverId }: ServerHeaderNavButtonsProps) {
    const isDeviceSm = useMediaQuery('(max-width: 640px)');
    const pathname = usePathname();

    const createQueryString = (name: string, value: string) => {
        const params = new URLSearchParams();
        params.set(name, value);
        return params.toString();
    };

    if (isDeviceSm)
        return (
            <div className="mt-4">
                <button className="border-2 rounded-sm px-4 py-2">
                    Options
                </button>
            </div>
        );
    return (
        <div className="flex gap-2 sm:gap-4 mt-4">
            <Link className="border-2 rounded-sm px-4 py-2" href={pathname}>
                Info
            </Link>
            <Link
                className="border-2 rounded-sm px-4 py-2"
                href={`${pathname}?${createQueryString('view', 'stats')}`}
            >
                Stats
            </Link>
            <Link
                className="border-2 rounded-sm px-4 py-2"
                href={`${pathname}?${createQueryString('view', 'manage')}`}
            >
                Manage
            </Link>
        </div>
    );
}

export default ServerHeaderNavButtons;
