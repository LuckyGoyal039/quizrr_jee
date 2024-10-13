'use client'

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Camera, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Loader from '../loader';
import Webcam from "react-webcam";

interface Question {
    text: string;
    options: { [key: string]: string };
}

interface TestData {
    name: string;
    duration: number;
    questions: Question[];
}

const TestInterface: React.FC<{ testId: string }> = ({ testId }) => {
    const [testData, setTestData] = useState<TestData | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [webcamActive, setWebcamActive] = useState(false);
    const [testStarted, setTestStarted] = useState(false);
    const [videoError, setVideoError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoRefnew = useRef(null);

    useEffect(() => {
        const fetchTestData = async () => {
            try {
                const token = localStorage.getItem('token');
                const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

                const resp = await axios.get(
                    `${SERVER_BASE_URL}/user/test-data/${testId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log(resp.data);
                setTestData(resp.data);
                setTimeRemaining(resp.data.duration * 60);
            } catch (error) {
                console.error("Failed to start the test:", error);
                alert("Failed to start the test. Please try again.");
            }
        };

        fetchTestData();
    }, [testId]);

    useEffect(() => {
        if (!testStarted || timeRemaining <= 0) return;

        const timer = setInterval(() => {
            setTimeRemaining((prevTime) => {
                if (prevTime <= 0) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [testStarted, timeRemaining]);

    useEffect(() => {
        const handleFullScreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
            if (!document.fullscreenElement) {
                handleSubmit();
            }
        };

        const preventDefaultActions = (e: Event) => e.preventDefault();

        document.addEventListener('fullscreenchange', handleFullScreenChange);
        document.addEventListener('contextmenu', preventDefaultActions);
        document.addEventListener('copy', preventDefaultActions);
        document.addEventListener('paste', preventDefaultActions);
        document.addEventListener('cut', preventDefaultActions);
        window.addEventListener('beforeprint', preventDefaultActions);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
            document.removeEventListener('contextmenu', preventDefaultActions);
            document.removeEventListener('copy', preventDefaultActions);
            document.removeEventListener('paste', preventDefaultActions);
            document.removeEventListener('cut', preventDefaultActions);
            window.removeEventListener('beforeprint', preventDefaultActions);
        };
    }, []);

    const enterFullScreen = () => {
        document.documentElement.requestFullscreen();
    };

    const startWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current?.play();
                };
            }
            setWebcamActive(true);
            setVideoError(null);
        } catch (err) {
            console.error("Error accessing the webcam", err);
            setVideoError("Failed to access webcam. Please ensure you've granted permission and your camera is working.");
            setWebcamActive(false);
        }
    };

    const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAnswers({
            ...answers,
            [currentQuestionIndex]: e.target.value,
        });
    };

    const handleNext = () => {
        if (currentQuestionIndex < (testData?.questions.length || 0) - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = () => {
        console.log('Test submitted with answers:', answers);
        alert('Test submitted successfully!');
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    };

    const startTest = () => {
        enterFullScreen();
        setTestStarted(true);
    };

    if (!testData) {
        return (
            <div className="flex flex-col items-center justify-center h-screen w-full">
                <Loader />
            </div>
        );
    }

    if (!isFullScreen || !webcamActive || !testStarted) {
        return (
            <div className='flex flex-col items-center justify-center h-screen w-full'>
                <div className="flex justify-center flex-col items-center">
                    <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Secure Test Environment</AlertTitle>
                        <AlertDescription>
                            This test must be taken in full-screen mode with webcam enabled.
                        </AlertDescription>
                    </Alert>
                    {!webcamActive && (
                        <>
                            <button
                                onClick={startWebcam}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Enable Webcam
                            </button>
                            {videoError && (
                                <Alert variant="destructive" className="mt-4">
                                    <AlertTitle>Webcam Error</AlertTitle>
                                    <AlertDescription>{videoError}</AlertDescription>
                                </Alert>
                            )}
                        </>
                    )}
                </div>
                {webcamActive && !testStarted && (
                    <button
                        onClick={startTest}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Start Test
                    </button>
                )}
                {webcamActive && (
                    <div className="mt-4 w-64">
                        {/* <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full rounded-lg border-2 border-blue-500"
                        /> */}
                        <Webcam ref={videoRefnew} className="w-full rounded-lg border-2 border-blue-500" />
                    </div>
                )}
            </div>
        );
    }

    const currentQuestion = testData.questions[currentQuestionIndex];

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="mb-4 flex justify-between items-center mt-40">
                <h1 className="text-2xl font-bold">{testData.name}</h1>
                <div>Time Remaining: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</div>
            </div>
            <div className="mb-6">
                <p className="text-lg">
                    Question {currentQuestionIndex + 1} of {testData.questions.length}
                </p>
                <p className="text-xl font-medium mt-2">{currentQuestion.text}</p>
                <div className="mt-4 space-y-2">
                    {Object.entries(currentQuestion.options).map(([key, value]) => (
                        <label key={key} className="block">
                            <input
                                type="radio"
                                name={`question-${currentQuestionIndex}`}
                                value={key}
                                checked={answers[currentQuestionIndex] === key}
                                onChange={handleOptionChange}
                                className="mr-2"
                            />
                            {value}
                        </label>
                    ))}
                </div>
            </div>

            <div className="flex justify-between mt-8">
                <button
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                    Previous
                </button>
                {currentQuestionIndex === testData.questions.length - 1 ? (
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                        Submit
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                        Next
                    </button>
                )}
            </div>

            <div className="fixed bottom-4 right-4 w-64">
                {/* <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline
                    muted 
                    className="w-full rounded-lg border-2 border-blue-500" 
                /> */}
                <Webcam ref={videoRefnew} className="w-full rounded-lg border-2 border-blue-500" />
            </div>
        </div>
    );
};

export default TestInterface;