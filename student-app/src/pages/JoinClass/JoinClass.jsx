import React from 'react'
import './joinclass.css'
import Navbar from '../../components/NavBar/NavBar'

const JoinClass = () => {
    return (
        <>
            <Navbar />
            <section className='std_signup'>
                <div className="container grid grid-cols-1 md:flex px-0 w-[400px] h-full md:w-[850px] md:h-[450px] md:mt-10 mt-[10%]" id="container">
                    <div className="form-container sign-in-container w-full md:w-[60%]">
                        <form action="#">
                            <h1 className='text-dark text-3xl lg:text-4xl font-bold !leading-snug md:mt-2 mt-10'>Join a Class</h1>
                            <p className='text-dark2 mb-2'>Enter your Class Code</p>
                            {/* <div className="infield w-[100%]">
                                <input type="text" placeholder="Full Name" name="fname" />
                                <label></label>
                            </div> */}
                            <div className="infield w-[100%]">
                                <input type="text" placeholder="Class Code" name="code" />
                                <label></label>
                            </div>
                            <a href="/classes" className='primary-btn w-[50%] text-[15px] uppercase mb-5 text-center mt-[17px]'>
                                Join</a>
                            {/* <button className='primary-btn w-[50%] text-[15px] uppercase mb-5'>
                        Join</button> */}
                        </form>
                    </div>

                    <div className="overlay-container" id="overlayCon">
                        <div className="overlay">
                            <div className="overlay-panel overlay-right">
                                <h1 className='text-white text-3xl lg:text-4xl font-bold !leading-snug md:mt-2 mt-8'>Hello There!</h1>
                                <p className=''>Ready to start a new Math journey? Enter the Code given by your Teacher</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default JoinClass