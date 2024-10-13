// 'use client'
// import { useState, useCallback, useRef, useEffect } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import Loader from '../loader'
// import { Button } from '../ui/button'
// import InputComponent from './InputComp'

// export default function OnBoarding() {
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const [loading, setLoading] = useState(false);
//     const email = "Lucky";
//     const stepNo = useRef(1);

//     useEffect(() => {
//         const step = searchParams.get('step');
//         if (step) {
//             stepNo.current = Number(step);
//         }
//     }, [searchParams]);

//     const handleNext = useCallback(async () => {
//         setLoading(true);
//         try {
//             const nextStep = stepNo.current + 1;
//             router.push(`?step=${nextStep}`);
//             stepNo.current = nextStep;
//         } catch (error) {
//             console.error('Error navigating to next step:', error);
//         } finally {
//             setLoading(false);
//         }
//     }, [router]);

//     return (
//         <div className="flex flex-col items-center border relative p-6 w-[50%]">
//             <div className="-mt-16">
//                 <div className="bg-[#bf360c] w-fit py-4 px-7 rounded-[100%]">
//                     <h1 className="text-white text-5xl">{email[0]?.toUpperCase()}</h1>
//                 </div>
//             </div>
//             <div className="flex flex-col items-center mt-4">
//                 {loading ? <Loader /> : <InputComponent stepNo={stepNo.current} />}
//             </div>
//             <div className="mt-4">
//                 <Button onClick={handleNext}>Save & Next</Button>
//             </div>
//         </div>
//     );
// }