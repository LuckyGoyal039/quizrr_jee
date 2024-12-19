'use client'
import React, { useEffect, useMemo, useState } from 'react';
import TestResultTable from './testResultTable';
import SearchIcon from '@mui/icons-material/Search';
import NoData from '../common/noData';

interface ResultsSchema {
    test_id: string,
    correct: number,
    incorrect: number,
    test_date: string,
    test_name: string
}
const MyMistakes: React.FC = () => {
    const [results, setResults] = useState([])
    const [search, setSearch] = useState<string>('')

    const getReslts = async () => {
        try {
            const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL
            const token = localStorage.getItem('token')
            const url = `${SERVER_BASE_URL}/user/results-list`
            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const resJson = await res.json()
            setResults(resJson)
        } catch (err) {
            console.log('unable to get test results: ', err);
        }
    }

    const filteredResults = useMemo(() => {
        if (!search.trim()) {
        }
        return results.filter((result: ResultsSchema) =>
            result.test_name.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, results]);


    useEffect(() => {
        getReslts()
    }, [])
    return (
        <>
            <div>
                <h1 className='text-center font-bold text-3xl'>My Mistakes</h1>
            </div>
            <div className='flex justify-end w-full my-5'>
                <form className={`w-96`}>
                    <div className="relative block ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <SearchIcon />
                        </div>
                        <input
                            type="search"
                            id="default-search"
                            className="focus:outline-none focus:ring-0 w-[70%] bg-transparent text-md py-2"
                            placeholder='Search...'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            className={`text-white absolute end-2.5 bottom-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm px-4 py-1 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
                        >
                            Search
                        </button>
                    </div>
                </form>
            </div>
            {
                filteredResults.length ?
                    <TestResultTable data={filteredResults} /> :
                    <div>
                        <NoData msg={"No results found"} />
                    </div>
            }

        </>
    )
}

export default MyMistakes