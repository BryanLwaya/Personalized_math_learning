import React from 'react';
import { FaInstagram, FaWhatsapp, FaFacebook, FaTiktok } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
    return (
        <footer className='py-28 bg-[#f7f7f7] contact-us' id='contact-us'>
            <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="container">
                <div className="grid grid-cols1 md:grid-cols-2 lg:grid-cols-3 gap-14 md:gap-4">
                    {/* First Section */}
                    <div className='space-y-4 max-w-[300px]'>
                        <h1 className='text-2xl font-bold'>MathGoal</h1>
                        <p className='text-dark'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ducimus a non minus facere laborum sapiente ut tenetur, consequatur ab, sed facilis eveniet rem error expedita eius nobis dolore! Veniam, provident?</p>
                    </div>
                    {/* Second Section */}
                    <div className="grid">
                        <div className='space-y-4'>
                            <h1 className="text-2xl font-bold">Links</h1>
                            <div className='text-dark2'>
                                <ul className='space-y-2 text-lg'>
                                    <li className='cursor-pointer hover:text-secondary duration-200'>Home</li>
                                    <li className='cursor-pointer hover:text-secondary duration-200'>Learn</li>
                                    <li className='cursor-pointer hover:text-secondary duration-200'>About</li>
                                    <li className='cursor-pointer hover:text-secondary duration-200'>Contact Us</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {/* Third Section */}
                    <div className='space-y-4 max-w-[300px]'>
                        <h1 className='text-2xl font-bold'>Get In Touch</h1>
                        <div className='flex items-center'>
                            <input 
                            type="text"
                            placeholder='Enter your email'
                            className='p-3 rounded-s-xl bg-white w-full py-4 focus:ring-0 focus:outline-none placeholder:text-dark2'
                             />
                             <button className='bg-primary text-white font-semibold py-4 px-6 rounded-e-xl'>Go</button>
                        </div>
                        {/* social media */}
                        <div className='flex space-x-6 py-3 text-xl'>
                            <a href="#">
                                <FaWhatsapp className='cursor-pointer hover:text-primary hover:scale-105 duration-200'/>
                            </a>
                            <a href="#">
                                <FaFacebook className='cursor-pointer hover:text-primary hover:scale-105 duration-200'/>
                            </a>
                            <a href="#">
                                <FaInstagram className='cursor-pointer hover:text-primary hover:scale-105 duration-200'/>
                            </a>
                            <a href="#">
                                <FaTiktok className='cursor-pointer hover:text-primary hover:scale-105 duration-200'/>
                            </a>
                        </div>
                    </div>
                </div>
            </motion.div>
        </footer>
    )
}

export default Footer