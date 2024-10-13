'use client'

import React, { useEffect, useState } from 'react';
import TestCard from './TestCard';
import StartTestModal from './StartTestModal';
import axios from 'axios';

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
            const formattedData = respData.map(item => ({
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
                    testList.map((ele, index) => (
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
