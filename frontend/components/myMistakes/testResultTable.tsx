'use client'
import React from 'react';

interface TestResult {
    test_id: number;
    correct: number;
    incorrect: number;
    test_date: string;
    test_name: string;
}

interface TestResultTableProps {
    data: TestResult[];
}

const TestResultTable: React.FC<TestResultTableProps> = ({ data = [] }) => {
    const handleRowClick = (testId: number) => {
        // Open a new link based on test_id or navigate to a specific page
        window.location.href = `/test-results/${testId}`;
    };

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Test Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Correct Answers
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Incorrect Answers
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Test Date
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((test) => (
                        <tr
                            key={`${test.test_date}`}
                            className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                            onClick={() => handleRowClick(test.test_id)}
                        >
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {test.test_name}
                            </td>
                            <td className="px-6 py-4">{test.correct}</td>
                            <td className="px-6 py-4">{test.incorrect}</td>
                            <td className="px-6 py-4">
                                {new Date(test.test_date).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 relative group">
                                <a
                                    href="#"
                                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline group-hover:block hidden"
                                >
                                    View
                                </a>
                                <span className="group-hover:block hidden absolute top-0 right-0 text-blue-500">View</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TestResultTable;
