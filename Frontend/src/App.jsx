import React, { useEffect, useState } from 'react'
import Register from './component/Register'
import Login from './component/Login'
import Home from './Pages/Home'
import Navbar from './Pages/Navbar'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Room from './Pages/Room'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";





const App = () => {
 
  return (
    <div>
      <ToastContainer position="top-right" autoClose={2000} />
     <BrowserRouter>
     <Navbar/>
     <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path="/hotels/:hotel_id/rooms" element={<Room/>} />
     
     </Routes>
     </BrowserRouter>
    </div>  
  )
}

export default App