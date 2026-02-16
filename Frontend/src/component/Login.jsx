import React from 'react'
import { useState } from 'react'

const Login = () => {

    const[user,setUse]=useState({
        email:"",
        password:""
    })
  

 const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        console.log(data);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  };

  return (
    <div>
    <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Enter your email" value={user.email} onChange={(e)=>setUse({...user,email:e.target.value})}/>
     <input type="password" placeholder="Enter your password" value={user.password} onChange={(e)=>setUse({...user,password:e.target.value})}/>
     <button type="submit">Submit</button>
    </form>
    </div>
  )
}

export default Login