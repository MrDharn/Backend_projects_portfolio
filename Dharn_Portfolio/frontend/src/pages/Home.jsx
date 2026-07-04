import React from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

import Hero from '../components/sections/Hero'
import Skills from '../components/data/skills'
import About from '../components/sections/About'
import Contact from '../components/sections/Contact'
import Experience  from '../components/sections/Experience'
const Home = () => {
  return (
    <>
        <Navbar/>

        <Hero/>

        <About/>

        <Skills/>

        <Experience/>

        <Projects/>

        <Contact/>

        <Footer/>
    </>
  )
}

export default Home