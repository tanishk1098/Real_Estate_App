import React from 'react'
import Navbar from './Navbar'
import { motion } from "framer-motion"
import { tr } from 'framer-motion/m'

const Header = () => {
  return (
    //overflow hidden:That means anything inside the element that goes beyond its box boundaries will be clipped and not visible — no scrollbars will appear.
    //min-h-screen is  like min height is 100%of screen height,same as 100vh; bg -cover 	Ensures the background image fully covers the container without repeating or squishing; items-center:Vertically centers any child elements inside this flexbox; 
    <div className='min-h-screen mb-4 bg-cover bg-center flex items-center w-full ' style={{backgroundImage: "url('/header_img.png')"}} id='Header'>{/*here url is a css property */}
      <Navbar/>
      <motion.div 
      initial={{opacity: 0, y:100}}
      transition={{duration: 1.5}}
      whileInView={{opacity: 1, y:0}}
      viewport={{once: true}}
      className='container text-center mx-auto py-4 px-6 md:px-20 lg:px-32 text-white'>
        <h2 className='text-5xl sm:text-6xl md:text-[82px] inline-block max-w-3xl font-semibold pt-20'>Explore homes that fit your dreams</h2>
        <div className='space-x-6 mt-16'>
            <a href="#Projects" className='border border-white px-8 py-3 rounded'>Projects</a>
            <a href="#Contact" className='bg-blue-500 px-8 py-3 rounded'>Contact Us</a>
        </div>
      </motion.div>
    </div>
  )
}

export default Header
