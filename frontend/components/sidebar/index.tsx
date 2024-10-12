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
function Sidebar() {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    return (
        <>
            <button
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
            </button>

            <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-48 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                    <Link href="/dashboard" className="flex items-center ps-2.5 mb-5">
                        <Image
                            src={QuizLogo}
                            width={32}
                            height={32}
                            className="h-6 me-3 sm:h-7 bg-transparent"
                            alt="Flowbite Logo"
                        />
                        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">QUIZZR</span>
                    </Link>

                    <hr />
                    <ul className="space-y-2 font-medium mt-8">
                        <li>
                            <Link href="/dashboard" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <HomeOutlinedIcon />
                                <span className="ms-3">Home</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/testseries" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <RocketOutlinedIcon />
                                <span className="ms-3">PACKS</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/notebooks" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <BookmarkAddOutlinedIcon />
                                <span className="ms-3">NOTEBOOKS</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/mistakes" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <WarningAmberIcon />
                                <span className="ms-3">MY MISTAKES</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/account" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <PersonOutlineOutlinedIcon />
                                <span className="ms-3">PROFILE</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </aside>

            {/* <div className="p-4 sm:ml-64">
                <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                    
                </div>
            </div> */}
        </>
    );
};

export default Sidebar;