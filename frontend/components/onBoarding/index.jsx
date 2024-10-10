'use client'

import { useState, useEffect } from 'react'
import Loader from '../loader'
import { Button } from '../ui/button'
import InputComponent from './InputComp'
import { useRouter, useSearchParams } from 'next/navigation';

export default function OnBoarding() {
    const router = useRouter();
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(false);
    const [stepNo, setStepNo] = useState(1);
    const email = "Lucky";

    useEffect(() => {
        const step = searchParams.get('step');
        if (!step) {
            return;
        }
        setStepNo(Number(step));

    }, [searchParams]);

    function handleClick() {
        
    }

    return (
        <div className="flex flex-col items-center border relative p-6 w-[50%]">
            <div className="-mt-16">
                <div className="bg-[#bf360c] w-fit py-4 px-7 rounded-[100%]">
                    <h1 className="text-white text-5xl">{email[0]?.toUpperCase()}</h1>
                </div>
            </div>
            <div className="flex flex-col items-center mt-4">
                {loading ? <Loader /> : (
                    <>
                        {stepNo ? (
                            <InputComponent stepNo={stepNo} />
                        ) : (
                            <p>Loading step...</p>
                        )}
                        {/* You can add your other components here */}
                    </>
                )}
            </div>
            <div className="mt-4">
                <Button onClick={handleClick}>Save & Next</Button>
            </div>
        </div>
    );
}
