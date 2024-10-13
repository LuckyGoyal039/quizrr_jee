import React from 'react';
// import Notes from "@/components/Notes";
import Sidebar from "@/components/sidebar";
import TestList from '@/components/testList';

const Page: React.FC = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 p-4 sm:ml-48 overflow-y-auto">
                <p className='text-sm text-gray-400'>OVERVIEW</p>
                <h1 className='font-bold text-2xl pb-5'>Test Series Packs</h1>
                <hr />
                <div className='pt-10'>
                    <TestList />
                </div>
            </main>
        </div>
    );
}

export default Page;