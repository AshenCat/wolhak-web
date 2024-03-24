'use client';

import Link from 'next/link';
import React from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';

function NavbarLinks() {
    const isDeviceSm = useMediaQuery('(max-width: 640px)');

    if (isDeviceSm) return <></>;

    return (
        <div className="flex items-center">
            <Link href={'/servers'} className="underline underline-offset-4">
                Servers
            </Link>
        </div>
    );
}

export default NavbarLinks;
