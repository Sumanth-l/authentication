import React, { useEffect, useState } from 'react'
import Register from './component/Register'
import Login from './component/Login'
import Home from './Pages/Home'
import Navbar from './Pages/Navbar'
import {BrowserRouter,Route,Routes} from 'react-router-dom'




const App = () => {
 
  return (
    <div>
      
     <BrowserRouter>
     <Navbar/>
     <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
     </Routes>
     </BrowserRouter>
    </div>  
  )
}

export default App