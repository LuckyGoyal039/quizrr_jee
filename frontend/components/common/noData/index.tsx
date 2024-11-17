import React from 'react'
import NoDataImage from '../../../assets/images/data-search-not-found-.png'
import Image from 'next/image'
interface NoDataProps {
    msg: string
}
const NoData: React.FC<NoDataProps> = ({ msg }) => {
    return (
        <div className='flex justify-center items-center flex-col'>
            <Image src={NoDataImage} alt="Data not found" width={300} height={300} className='bg-transparent' />
            <h1 className='text-2xl'>{msg}</h1>
        </div>
    )
}

export default NoData