import { useRef, useState } from "react";
import "./register.css"
import RoomIcon from '@mui/icons-material/Room';
import axios from "axios";
import ClearIcon from '@mui/icons-material/Clear';

export default function Register({setShowRegister}) {

const [success,setSuccess]=useState(false);
const [error,setError]=useState(false);
const nameRef=useRef();
const emailRef=useRef();
const passwordRef=useRef();

const handleSubmit=async(e)=>{
  e.preventDefault();
  const newUser={
    username:nameRef.current.value,
    email:emailRef.current.value,
    password:passwordRef.current.value,
  }

  try{
    await axios.post("/users/register",newUser)
    setSuccess(true);
    setError(false);


  }catch(err){
    setError(true)

  }
}

  return (

    <div className="registerContainer">
        
        <div className="logo"> 
         <RoomIcon/>
         PinLocation
        </div>

        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="username" ref={nameRef}/>
            <input type="email" placeholder="email" ref={emailRef}/>
            <input type="password" placeholder="password" ref={passwordRef}/>
            <button className="registerBtn">Register</button>
            {success && <span className="success">login successful</span>}
            {error && <span className="failure">something went wrong</span>}
        </form>

        <ClearIcon className="registerCancel" onClick={()=>{setShowRegister(false)}}/>
        
    </div>
  )
}
