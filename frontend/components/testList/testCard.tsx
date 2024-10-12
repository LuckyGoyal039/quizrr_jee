import React from 'react';

interface TestCardProps {
    batch: string;
    target: string;
    title: string;
    tests: string[];
    buttonText: string;
    viewPacksText: string;
}

const TestCard: React.FC<TestCardProps> = ({
    batch,
    target,
    title,
    tests,
    buttonText,
    viewPacksText,
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
                {/* Batch Label */}
                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                    {batch}
                </div>

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
                <div className="flex justify-between items-center">
                    <button className="text-blue-500 underline hover:text-blue-700 transition">
                        {viewPacksText}
                    </button>
                    <button className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition">
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TestCard;
