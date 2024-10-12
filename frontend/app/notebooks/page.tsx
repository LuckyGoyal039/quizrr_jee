import React from 'react';
import Notes from "@/components/Notes";
import Sidebar from "@/components/sidebar";

const Page: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-4 sm:ml-48 overflow-y-auto">
        <Notes />
      </main>
    </div>
  );
}

export default Page;