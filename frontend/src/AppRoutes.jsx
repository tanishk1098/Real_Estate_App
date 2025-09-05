import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import Signin from "./components/Signin";
import Testimonails from "./components/Testimonails";
import PropertyForm from "./components/form";
import { ToastContainer } from 'react-toastify';
import  AgentDashboard from "./components/dashboard";
import Property from "./components/property";
import AllProperties from "./components/allProperties";
const AppRoutes = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<>
      <ToastContainer/>
      <Header/>
      <About/>
      <Projects/>
      <Testimonails/>
      <Contact/>
      <Footer/>
      </>} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/add-property" element={<PropertyForm />} />
      <Route path="/dashboard" element={<AgentDashboard />} />
      <Route path="/property/:id" element={<Property />} />
      <Route path="/all-properties" element={<AllProperties />} />
    </Routes>
  </Router>
);

export default AppRoutes;
