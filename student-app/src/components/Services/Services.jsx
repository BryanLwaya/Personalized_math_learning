import React from 'react'
import { IoMdHappy } from 'react-icons/io'
import { BiMath } from "react-icons/bi";
import { TbMathXPlusY } from "react-icons/tb";
import { TbMathMaxMin } from "react-icons/tb";
import { motion } from 'framer-motion';

const ServicesData = [
    {
        id:1,
        title: "Solve Equations",
        link: "#",
        icon: <BiMath />,
        delay: 0.4,
    },
    {
        id: 2,
        title: "Understand Questions",
        link: "#",
        icon: <IoMdHappy />,
        delay: 0.4,
    },
    {
        id: 3,
        title: "Practical Math Quizes",
        link: "#",
        icon: <TbMathMaxMin />,
        delay: 0.4,
    },
    {
        id: 4,
        title: "Answer Word Problems",
        link: "#",
        icon: <TbMathXPlusY />,
        delay: 0.4,
    },
];

const SlideLeft = (delay) => {
    return {
        initial: {
            opacity: 0,
            x: 50,
        },
        animate: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.3,
                delay: delay,
                ease: "easeInOut",
            },
        },
    };
};

const Services = () => {
    return (
        <section className='bg-white services'>
            <div className="container pb-14 pt-16">
                <h1 className='text-4xl font-bold text-left pb-10'>
                    What Will You Learn?
                </h1>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
                    {ServicesData.map((service) => (
                        <motion.div 
                        variants={SlideLeft(service.delay)}
                        initial="initial"
                        whileInView={"animate"}
                        viewport={{ once: true }}
                        key = {service.id}
                        className='bg-[#f4f4f4] rounded-2xl flex flex-col gap-4 items-center justify-center p-4 py-7 hover:bg-white hover:scale-110 duration-300 hover:shadow-2xl'>
                            <div className='text-4xl mb-4'>
                                {service.icon}
                            </div>
                            <h1 className='text-lg font-semibold text-center px-3'>
                                {service.title}
                            </h1>
                        </motion.div>
                    ))

                    }
                </div>
            </div>
        </section>
    )
}

export default Services