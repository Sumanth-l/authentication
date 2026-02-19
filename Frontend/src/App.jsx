import React, { useEffect, useState } from 'react'
import Register from './component/Register'
import Login from './component/Login'
import Home from './Pages/Home'
import Navbar from './Pages/Navbar'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Room from './Pages/Room'




const App = () => {
 
  return (
    <div>
      
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