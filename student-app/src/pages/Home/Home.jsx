import React from 'react'
import Navbar from '../../components/NavBar/NavBar'
import Hero from '../../components/Hero/Hero'
import Services from '../../components/Services/Services'
import Banner from '../../components/Banner/Banner'
import Banner2 from '../../components/Banner/Banner2'
import Footer from '../../components/Footer/Footer'

const Home = () => {
  return (
    <main className='overflow-x-hidden bg-white text-dark'>
    	<Navbar />
        <Hero />
        <Services />
        <Banner />
        <Banner2 />
        <Footer />
    </main>
  )
}

export default Home