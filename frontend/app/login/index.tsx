'use client'
import { useRef, useState, } from 'react'
import styles from './signIn.module.css';
import CloseIcon from '@mui/icons-material/Close';
import Header from '@/components/Header';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { isAuthenticate } from '@/store/atoms/Auth';
export default function SignIn() {

    const setAuth = useSetRecoilState(isAuthenticate);
    const email = useRef(null)
    const password = useRef(null)
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    async function handleSubmit(event: any) {
        event.preventDefault();
        try {
            let emailVal = email.current?.value;
            let passwordVal = password.current?.value;
            setError(null);
            let url = `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/user/sign-in`
            let userData = {
                email: emailVal,
                password: passwordVal
            }
            let res = await fetch(url, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            })

            const resp = await res.json();
            localStorage.setItem('token', resp.token);
            if (resp.token) {
                setAuth(true);
            }
            router.push('/');
        } catch (err) {
            alert('Something went wrong. Please try again')
        }
    }
    return (
        <>
            <Header />
            <div className={`${styles.main}`}>
                <div className={`px-16 pb-12 pt-5 rounded-xl bg-gray-700 border border-white`}>
                    <div className='text-end'>
                        <Link href={'/'} className='-mr-12'>
                            <CloseIcon />
                        </Link>
                    </div>
                    <form className={`${styles.signForm}`} onSubmit={handleSubmit}>
                        <h1 className='text-2xl underline'>Sign In</h1>
                        <div className={`flex flex-col w-full`}>
                            <label htmlFor='userEmail'>Email</label>
                            <input type="email" ref={email} className='border-black border-2 text-black rounded h-8' name='userEmail' />
                        </div>
                        <div className={`${styles.formFields}  w-full`}>
                            <label htmlFor='userpassword'>Password</label>
                            <input type="password" ref={password} className='border-black border-2 text-black rounded h-8' name='userPassword' />
                        </div>
                        <div className='text-end w-full'>
                            <a href='/forget-password' className='underline'><small>Forget password</small></a>
                        </div>
                        <div>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">
                                Submit
                            </button>
                        </div>
                    </form>
                    <div className='pt-8'>
                        <p className='text-center'>Create a new account <Link href='/sign-up' className='underline text-blue-400'>Sign Up</Link></p>
                    </div>
                </div>
            </div>
        </>
    )
}