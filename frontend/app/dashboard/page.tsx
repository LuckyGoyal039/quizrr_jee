import React from 'react';
import Notes from "@/components/Notes";
import Sidebar from "@/components/sidebar";
import TestList from '@/components/testList';
// import TestCard from '@/components/testCard';

const Page: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-10 sm:ml-48 overflow-y-auto">
        <h1 className='font-bold text-blue-600 text-2xl pb-2'>Good Morning, Lucky Goyal!</h1>
        <p className='text-gray-400'>Welcome back! All the best because #PaperPhodnaHai</p>
        <h1 className='text-2xl py-5'>Explore other test series</h1>
        <TestList />
      </main>
    </div>
  );
}

export default Page;