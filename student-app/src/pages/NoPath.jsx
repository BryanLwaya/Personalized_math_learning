import React from 'react'
import Blob from '../assets/blob.svg';
import HeroPng from '../assets/hero.png';
import { motion } from 'framer-motion';
import { IoIosArrowRoundForward } from 'react-icons/io';

const NoPath = () => {
    return (
        <div className='container min-h-[550px] w-full mx-0 pt-8 grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-8 z-20'>
            <div>
                <h1 className='text-3xl lg:text-4xl font-bold !leading-snug'>
                    Error 404: Path Not Found
                </h1>
                <a href="/" className='primary-btn flex items-center gap-2 group w-fit mt-5'>
                    Home
                    <IoIosArrowRoundForward className='text-xl grop-hover:translate-x-2 group-hover:rotate-45 duration-300' />
                </a>
            </div>


            <div className='flex justify-center items-center'>
                <motion.img
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4, ease: 'easeInOut' }}
                    src={HeroPng}
                    alt=""
                    className='w-[300px] xl:w-[500px] relative z-10 drop-shadow' />
            </div>
        </div>
    )
}

export default NoPath