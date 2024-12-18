'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import QuizLogo from '../../assets/images/quizlogo.png'
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import RocketOutlinedIcon from '@mui/icons-material/RocketOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={toggleSidebar}
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 absolute z-40"
            >
                <MenuIcon />
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            <aside
                className={`fixed top-0 left-0 z-40 w-48 h-screen transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                    md:translate-x-0`}
                aria-label="Sidebar"
            >
                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                    <div className='flex justify-between'>
                        <Link href="/dashboard" className="flex items-center ps-2.5 mb-5" onClick={() => setIsOpen(false)}>
                            <Image
                                src={QuizLogo}
                                width={32}
                                height={32}
                                className="h-6 me-3 sm:h-7 bg-transparent"
                                alt="Flowbite Logo"
                            />
                            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">QUIZZR</span>
                        </Link>
                        <button
                            onClick={toggleSidebar}
                            className="flex items-center p-2 mb-4 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden relative right-[-15px] top-[-10px]"
                        >
                            <CloseIcon className="me-2" />
                        </button>
                    </div>

                    <hr className="mb-6" />

                    <ul className="space-y-2 font-medium">
                        <li>
                            <Link
                                href="/dashboard"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                onClick={() => setIsOpen(false)}
                            >
                                <HomeOutlinedIcon />
                                <span className="ms-3">Home</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/testseries"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                onClick={() => setIsOpen(false)}
                            >
                                <RocketOutlinedIcon />
                                <span className="ms-3">PACKS</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/notebooks"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                onClick={() => setIsOpen(false)}
                            >
                                <BookmarkAddOutlinedIcon />
                                <span className="ms-3">NOTEBOOKS</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/mistakes"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                onClick={() => setIsOpen(false)}
                            >
                                <WarningAmberIcon />
                                <span className="ms-3">MY MISTAKES</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/account"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                onClick={() => setIsOpen(false)}
                            >
                                <PersonOutlineOutlinedIcon />
                                <span className="ms-3">PROFILE</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;