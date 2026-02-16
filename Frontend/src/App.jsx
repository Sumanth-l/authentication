import React, { use, useEffect, useState } from 'react'
import Register from './component/Register'
import Login from './component/Login'


const App = () => {
  const[showLogin,setShowLogin]=useState(false)

  useEffect(()=>{
    const stored=JSON.parse(localStorage.getItem("user"))
    if(stored){
      setShowLogin(true)
    }
  })




  return (
    <div>
     <Login/>

    </div>
  )
}

export default App