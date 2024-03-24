// 'use client';

// importing necessary functions
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
    // extracting data from usesession as session
    const session = await auth();

    // console.log(session)
    // checking if sessions exists
    if (session && session.user) {
        // rendering components for logged in users
        redirect('/servers');
    }

    // rendering components for not logged in users
    return (
        <div className="w-full h-screen flex flex-col justify-center items-center">
            <p className="text-2xl mb-2">Not Signed In</p>
        </div>
    );
}
