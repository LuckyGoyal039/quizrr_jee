// app/givetest/[testId]/page.tsx
import React from 'react';
import TestInterface from '@/components/testList/TestInterface';

const Page: React.FC<{ params: { testId: string } }> = ({ params }) => {
    const { testId } = params;

    return (
        <div className="flex h-screen bg-gray-100">
            <TestInterface testId={testId} />
        </div>
    );
};

export default Page;
