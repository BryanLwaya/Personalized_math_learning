import React, { useEffect, useState } from 'react';
import { IoMdMenu } from "react-icons/io";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Link } from 'react-scroll';
import "./Navbar.css";

const NavbarMenu = [
    {
        id: 1,
        title: 'Services',
        path: "services",
    },
    {
        id: 2,
        title: 'About Us',
        path: "about-us",
    },
    {
        id: 3,
        title: 'Contact Us',
        path: "contact-us",
    },
];

const Navbar = () => {
    const [sticky, setSticky] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        window.addEventListener('scroll', () => {
            window.scrollY > 50 ? setSticky(true) : setSticky(false);
        });
    }, []);

    const [mobileMenu, setMobileMenu] = useState(false);
    const toggleMenu = () => {
        mobileMenu ? setMobileMenu(false) : setMobileMenu(true);
    };

    return (
        <nav className={`z-30 top-0 left-0 fixed w-full ${sticky ? 'dark-nav' : ''}`}>
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                className="container py-7 flex justify-between items-center">
                {/* Logo Section */}
                <div>
                    <h1 className="font-bold text-2xl">
                        MathGoal
                    </h1>
                </div>

                {/* Menu Section */}
                <div>
                    <ul className={`flex items-center flex-wrap gap-3 nav-items ${mobileMenu ? '' : 'hide-menu'}`}>
                        <li>
                            <a href="/"
                                className='inline-block py-2 px-3 hover:text-secondary relative group'
                            >
                                <div className="w-2 h-2 bg-secondary absolute mr-2 rounded-full left-1/2 -translate-x-1/2 top-3/4 bottom-0 group-hover:block hidden"></div>
                                Home
                            </a>
                        </li>
                        {NavbarMenu.map((menu) => (
                            <li key={menu.id}>
                                <Link to={menu.path} smooth={true} offset={-100} duration={500}
                                    className='inline-block py-2 px-3 hover:text-secondary relative cursor-pointer group'
                                >
                                    <div className="w-2 h-2 bg-secondary absolute mr-2 rounded-full left-1/2 -translate-x-1/2 top-3/4 bottom-0 group-hover:block hidden"></div>
                                    {menu.title}
                                </Link>
                            </li>
                        ))}
                        <button
                            className="primary-btn"
                            onClick={() => navigate("/classes")} // Navigate to Classes page on click
                        >
                            Learn
                        </button>
                    </ul>
                </div>

                {/* Mobile Title Section */}
                <div className="menu-icon cursor-pointer" onClick={toggleMenu}>
                    <IoMdMenu className='text-4xl' />
                </div>
            </motion.div>
        </nav>
    );
};

export default Navbar;
