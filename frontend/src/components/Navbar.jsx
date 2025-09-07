import React, { useEffect, useState } from 'react'
import {assets} from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { use } from 'react'
const Navbar = () => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [isSignedIn, setIsSignedIn] = useState(false);
    console.log(isSignedIn);
    const navigate=useNavigate();
    {/*THIS useEffect prevents the website from scrolling when mobile menu(small device mnenu) is open */}
useEffect(()=>{
    if(showMobileMenu){
        document.body.style.overflow = 'hidden'
    }else{ 
        document.body.style.overflow = 'auto'
    }
    return ()=>{
        document.body.style.overflow = 'auto'
    };
},[showMobileMenu])

useEffect(() => {
    const checkAuthStatus = async () => {
        try {
            const response = await fetch('https://real-estate-app-backend-g38w.onrender.com/api/protected', {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();
            if(response.status < 400) setIsSignedIn(true);
        } catch (error) {
            console.error('Error checking auth status:', error);
        }
    };

    checkAuthStatus();
}, []);

const handleSignInButton = () => {
    //alert("Sign up button clicked")
    navigate('/signin'); // Redirect to the Signin page
}
const handleSignOutButton = () => {
    fetch('https://real-estate-app-backend-g38w.onrender.com/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
    })
    .then(response => {
        if (response.ok) {
            setIsSignedIn(false);
            // navigate('/'); // Redirect to the home page
        } else {
            console.error('Error signing out:', response.statusText);
        }
    })
    .catch(error => {
        console.error('Error signing out:', error);
    });
}

  return (
    <div className='absolute top-0 left-0 w-full z-10 '>{/*commmon properties for all divs inside this div*/ }
      {/*----div for website main page, all screens */ }
      <div className='container mx-auto flex justify-between items-center py-4 px-6 md:px-20 lg:px-32 bg-transparent'>{/* container Prevents left/right elements(signup button and estate icon) from floating too far apart and still keeping the middle elements aligned to center , also contianer prevents the div to take 100% width;mx-auto:Centers the container horizontally (left & right margins auto);flex gives Applies Flexbox layout to the container;By default (small screens) mein px=6 and py=4  later increased px for medium and large screens*/}
        <img src={assets.logo} alt="" onClick={() => navigate('/')} />
        <ul className='hidden md:flex gap-7 text-white'>{/*hidden se pehle no prefix means,by default small screen ke liye hidden  AND show as flex in medium+ screens, NOTE: DONT USE block and fllex together , as it will disturb configuration of medium+screens bcz md:block means show as a block , so this wd show all 4 headings as 1 block without  any gaps so this wd ruin our flex layout,BLOCK IS GENERALLY USED FOR BUTTONS IN MEDIUM  SCREEN*/}
            <Link to='/' className='cursor-pointer hover:text-gray-400'>Home</Link>
            <a href="#About" className='cursor-pointer hover:text-gray-400'>About</a>
            <Link to='/all-properties' className='cursor-pointer hover:text-gray-400'>Properties</Link>
            {/* <a href="#Testimonials" className='cursor-pointer hover:text-gray-400'>Testimonials</a> */}
            <Link to="/dashboard" className='cursor-pointer hover:text-gray-400'>Dashboard</Link>
        </ul>
        {
            isSignedIn ? 
            <>
            <button onClick={handleSignOutButton} className='hidden md:block bg-white px-8 py-2 rounded-full'>Sign out</button>{/*HIDDEN :NO PREFIX:hidden for small screens and md:block means show the signup button as a block for medium+screens*/}
            </>:
            <>
            <button onClick={handleSignInButton} className='hidden md:block bg-white px-8 py-2 rounded-full'>Sign up</button>{/*HIDDEN :NO PREFIX:hidden for small screens and md:block means show the signup button as a block for medium+screens*/}
            </>
        }
        
        
        <img onClick={()=> setShowMobileMenu(true)} src={assets.menu_icon} className='md:hidden w-8 cursor-pointer' alt="" />
      </div>
      {/* ---------mobile-menu------ */}
      {/*OVERFLOW HIDDEN: Ensures that when the menu is h-0 w-0, any child content (like <ul>) that’s larger than the container is clipped and not visible.*/}
      <div className={`md:hidden ${showMobileMenu ? 'fixed w-full' : 'h-0 w-0'} top-0 bottom-0 overflow-hidden bg-white transition-all`}>{/*since we used backtick and ${} , so we write it inside {} brackets*/}
          {/* DIV 1 of mobile menu div->*/}
        <div className='flex justify-end p-6 cursor-pointer'>
            <img onClick={()=> setShowMobileMenu(false)} src={assets.cross_icon} className='w-6' alt="" />
        </div>
            {/*PART 2 of mobile menu div-> */}
        <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
            <a onClick={()=> setShowMobileMenu(false)} href="#Header" className='px-4 py2 rounded-full'>Home</a>
            <a onClick={()=> setShowMobileMenu(false)} href="#About" className='px-4 py2 rounded-full '>About</a>
            <a onClick={()=> setShowMobileMenu(false)} href="#Projects" className='px-4 py2 rounded-full '>Projects</a>
            <a onClick={()=> setShowMobileMenu(false)} href="#Testimonails" className='px-4 py2 rounded-full inline-block'>Testimonails</a>
            <a onClick={()=> setShowMobileMenu(false)} href="#AddProperty" className='px-4 py2 rounded-full inline-block'>Add Property</a>
        </ul>
      </div>
    </div>
  )
}

export default Navbar
