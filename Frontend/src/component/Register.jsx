import { useState } from "react"


const Register = () => {
  
  const[user,setUser]=useState({
    name:"",
    email:"",
    password:""
  })

const handleSubmiyt = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:5000/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    });

    const data = await res.json();
    console.log(data);

    alert(data.message);
  } catch (error) {
    console.log(error);
  }
};





  return (
    <div>
    <form onSubmit={handleSubmiyt}>
      <input type="text" placeholder="Enter your name" value={user.name} onChange={(e)=>setUser({...user,name:e.target.value})}/>
     <input type="email" placeholder="Enter your email" value={user.email} onChange={(e)=>setUser({...user,email:e.target.value})}/>
     <input type="password" placeholder="Enter your password" value={user.password} onChange={(e)=>setUser({...user,password:e.target.value})}/>
     <button type="submit">Submit</button>
    </form>
    </div>
  )
}

export default Register