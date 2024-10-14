'use client'

import React, { useEffect, useState } from 'react';
// import {TestCard} from './testCard';
import StartTestModal from './StartTestModal';
import axios from 'axios';

interface TestCardData {
    testId: string;
    batch: string;
    target: string;
    title: string;
    tests: string[]; // Array of strings
    buttonText: string;
    viewPacksText: string;
}

interface TestCardProps {
    testId: string;
    batch: string;
    target: string;
    title: string;
    tests: string[];
    buttonText: string;
    viewPacksText: string;
    onButtonClick: (testId: string) => void;  // Pass testId when the button is clicked
}

export const TestCard: React.FC<TestCardProps> = ({
    testId,
    batch,
    target,
    title,
    tests,
    buttonText,
    // viewPacksText,
    onButtonClick,
}) => {
    return (
        <div className="relative max-w-sm rounded-lg overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl hover:scale-105 transform transition duration-300">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-60"
                style={{
                    backgroundImage: `url('/path-to-your-image.jpg')`,
                }}
            ></div>

            {/* Overlay for darkening the background */}
            <div className="absolute inset-0 bg-white opacity-80"></div>

            <div className="relative p-5">
                {batch && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                        {batch}
                    </div>
                )}

                {/* Target Section */}
                <h2 className="text-2xl font-bold text-yellow-500">{target}</h2>
                <p className="text-gray-700 font-semibold mt-1">{title}</p>

                {/* Test Details */}
                <ul className="my-4 space-y-2 text-gray-600">
                    {tests.map((test, index) => (
                        <li key={index} className="flex items-center">
                            <span className="text-green-500 mr-2">✔</span> {test}
                        </li>
                    ))}
                </ul>

                {/* View Packs and Button */}
                <div className="flex justify-end items-center">
                    {/* <button className="text-blue-500 underline hover:text-blue-700 transition">
                        {viewPacksText}
                    </button> */}
                    <button
                        className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition"
                        onClick={() => onButtonClick(testId)}  // Pass testId when clicked
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ParentComponent: React.FC = () => {
    const [testList, setTestList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
    // const [testData, setTestData] = useState(null)

    async function getTestList() {
        const token = localStorage.getItem("token");
        const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

        try {
            const resp = await axios.get(`${SERVER_BASE_URL}/user/test-list`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            const respData = resp.data;
            console.log(respData);

            // Transforming the response data into the desired format
            const formattedData = respData.map((item: TestCardData & {id: string; name: string; description: string}) => ({
                testId: item.id,
                batch: item.batch,
                target: item.target,
                title: item.name,
                tests: item.description.split('$*'),
                buttonText: "Give Test",
                viewPacksText: "View Packs",
            }));
            setTestList(formattedData);
        } catch (error) {
            console.error("Error fetching test list:", error);
        }
    }
    const toggleModal = (testId: string) => {
        setSelectedTestId(testId);
        setIsModalOpen(!isModalOpen);
    };

    const handleAccept = async () => {
        if (selectedTestId) {
            try {
                window.open(`/givetest/${selectedTestId}`, '_blank');
                setIsModalOpen(false);
            } catch (error) {
                console.error("Failed to start the test:", error);
                // alert("Failed to start the test. Please try again.");
            }
        }
    };


    useEffect(() => {
        getTestList();
    }, [])

    // if (testData) {
    //     return <TestInterface testData={testData} />;
    // }

    return (
        <>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {
                    testList.map((ele: TestCardData, index) => (
                        <li key={index}>
                            <TestCard
                                testId={ele.testId}
                                batch={ele.batch}
                                target={ele.target}
                                title={ele.title}
                                tests={ele.tests}
                                buttonText={ele.buttonText}
                                viewPacksText={ele.viewPacksText}
                                onButtonClick={toggleModal}
                            />
                        </li>
                    ))
                }
            </ul>

            {isModalOpen && (
                <StartTestModal
                    onAccept={handleAccept}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
};

export default ParentComponent;