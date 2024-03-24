'use client';
// import { useUserdataStore } from '@/store/userdata-store';
import Link from 'next/link';
import React, {
    useState,
    FormEvent,
    MouseEventHandler,
    MouseEvent,
} from 'react';
import { signIn } from 'next-auth/react';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
// import { useFormState, useFormStatus } from 'react-dom';
// import { login } from '../actions';

function LoginFormComponent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [state, setState] = useState<{ message?: string | null }>({
        message: null,
    });
    const [pending, setPending] = useState(false);

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPending(true);
        try {
            await signIn('credentials', {
                email,
                password,
                redirect: true,
                callbackUrl: '/dashboard',
            });
        } catch (err) {
            console.log(err);
            setState({ message: 'Email or Password is incorrect' });
        }
        setPending(false);
    };

    const onShowPassClick = (e: MouseEvent<HTMLElement>) => {
        e.preventDefault();
        setShowPass((prev) => !prev);
    };

    return (
        <>
            {state?.message && (
                <div className="border-2 border-red-400 bg-red-300 flex flex-col justify-center w-full p-3">
                    <h3 className="text-l font-bold">{state.message}</h3>
                </div>
            )}
            <form
                onSubmit={onSubmit}
                className="flex flex-col mx-auto items-center"
            >
                <div className="flex flex-col w-full">
                    <label
                        htmlFor="email"
                        className={`${
                            state?.message ? 'text-red-400' : ''
                        } text-base`}
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        className={`border-2 ${
                            state?.message
                                ? 'border-red-400 text-red-400'
                                : 'border-black text-black'
                        } py-4 px-2`}
                        name="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="flex flex-col w-full mt-[17px]">
                    <label
                        htmlFor="password"
                        className={`${
                            state?.message ? 'text-red-400' : ''
                        } text-base`}
                    >
                        Password
                    </label>
                    <div
                        className={`flex border-2 ${
                            state?.message
                                ? 'border-red-400 text-red-400'
                                : 'border-black text-black'
                        }`}
                    >
                        <input
                            type={showPass ? 'text' : 'password'}
                            className={'flex-1 py-4 px-2'}
                            name="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button onClick={onShowPassClick} className="px-2">
                            {showPass ? <BsEyeSlashFill /> : <BsEyeFill />}
                        </button>
                    </div>
                </div>
                <div className="flex w-full justify-end mt-4">
                    <button
                        type="submit"
                        disabled={pending}
                        className="w-[140px] text-center py-3 text-white text-xl bg-black font-semibold"
                    >
                        {pending ? <span className="spinner" /> : 'Login'}
                    </button>
                </div>
            </form>
        </>
    );
}

export default LoginFormComponent;
