import React from 'react';
// import Notes from "@/components/Notes";
import Sidebar from "@/components/sidebar";
import TestList from '@/components/testList';

const Page: React.FC = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 px-4 md:ml-48 overflow-y-auto">
                <div className='sticky top-0 z-10 left-auto right-auto bg-[#f3f4f6] w-full py-4'>
                    <p className='text-sm text-gray-400 text-center'>OVERVIEW</p>
                    <h1 className='font-bold text-2xl pb-5 text-center'>Test Series Packs</h1>
                    <hr />
                </div>
                <div className='pt-5'>
                    <TestList />
                </div>
            </main>
        </div>
    );
}

export default Page;