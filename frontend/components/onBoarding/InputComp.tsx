// 'use client'
// import { useState, useEffect } from 'react'
// import { Input } from '../ui/input'
// import { PhoneInput } from '../PhoneInput'
// import { SelectArea } from '../SelectArea'
// import { useToast } from '@/hooks/use-toast'

// const STEPS_CONFIG = [
//     {
//         key: 'displayname',
//         title: "Hey, champ! What's your name?",
//         subtitle: "Don't worry. You can change it later.",
//         type: 'text'
//     },
//     {
//         key: 'displayname',
//         title: "What's your mobile number?",
//         subtitle: "We won't spam you. You will receive only your test related information.",
//         type: 'text'
//     },
//     {
//         key: 'displayname',
//         title: "Please select your country",
//         subtitle: "",
//         type: 'text'
//     },
//     {
//         key: 'displayname',
//         title: "Please select your state",
//         subtitle: "",
//         type: 'text'
//     },
//     {
//         key: 'displayname',
//         title: "Please select your city",
//         subtitle: "",
//         type: 'text'
//     },
//     {
//         key: 'displayname',
//         title: "Enter your PIN code",
//         subtitle: "",
//         type: 'text'
//     },
//     {
//         key: 'displayname',
//         title: "In which class are you currently in?",
//         subtitle: "",
//         type: 'text'
//     },
//     {
//         key: 'displayname',
//         title: "Please select your Class 12th Board",
//         subtitle: "",
//         type: 'text'
//     },
    
// ];

// interface InputComponentProps {
//     stepNo: number;
// }

// export default function InputComponent({ stepNo }: InputComponentProps) {
//     const { toast } = useToast();
//     const [inputValue, setInputValue] = useState('');
//     const currentStep = STEPS_CONFIG[stepNo - 1] || STEPS_CONFIG[0];

//     const renderInput = () => {
//         switch (currentStep.type) {
//             case 'phone':
//                 return <PhoneInput onChange={setInputValue} />;
//             case 'select':
//                 return (
//                     <SelectArea
//                         name={currentStep.key}
//                         areas={[]} // You'll need to implement location data fetching
//                         keyname={`${currentStep.key}_name`}
//                         setVal={setInputValue}
//                     />
//                 );
//             default:
//                 return (
//                     <Input
//                         type={currentStep.type}
//                         onChange={(e) => setInputValue(e.target.value)}
//                         placeholder={currentStep.title}
//                     />
//                 );
//         }
//     };

//     return (
//         <div className="w-full">
//             <h1 className="text-xl pb-2">{currentStep.title}</h1>
//             {currentStep.subtitle && <p className="mb-4">{currentStep.subtitle}</p>}
//             {renderInput()}
//         </div>
//     );
// }