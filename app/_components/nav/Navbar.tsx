import Image from 'next/image';
import React from 'react';
import Dropdown from '../dropdown/Dropdown';
import { auth, signIn, signOut } from '@/auth';
import NavbarLinks from './NavbarLinks';

async function Navbar() {
    // extracting data from usesession as session
    const session = await auth();

    return (
        <nav className="flex navbar-bg text-white">
            <div className="flex flex-1 p-4">
                <div className='text-2xl'>WHS</div>
                {session && session?.user && <NavbarLinks />}
            </div>
            <div className="flex items-center">
                {!session && (
                    <form
                        action={async () => {
                            'use server';
                            await signIn('discord');
                        }}
                    >
                        <button className="p-4" type="submit">
                            Sign in with Discord
                        </button>
                    </form>
                )}
                {session && session?.user && (
                    <Dropdown
                        className=""
                        popUpClassName="navbar"
                        options={[
                            <form
                                key={'nav-signout'}
                                action={async () => {
                                    'use server';
                                    await signOut();
                                }}
                            >
                                <button type="submit">Sign Out</button>
                            </form>,
                        ]}
                    >
                        <div className="flex items-center pr-2">
                            <div className="flex items-center">
                                <Image
                                    src={session.user?.image as string}
                                    width={35}
                                    height={35}
                                    alt={session.user?.name || 'User image'}
                                    className="object-cover rounded-full"
                                />
                            </div>
                            <span className="font-bold px-2 text-xs sm:text-base">
                                {session.user?.name}
                            </span>
                        </div>
                    </Dropdown>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
