import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ButtonGroup from '@mui/material/ButtonGroup';

import {AuthContext} from "../context/AuthContext.jsx";

import { useState,useContext } from 'react';
function Login(){
    const [isLogin,setLogin] =useState(false);
     const [username,setUsername]=useState("");
     const [password,setPassword]=useState("");
     const [email,setEmail]=useState("");
     const {handleLogin,error,handleRegister}=useContext(AuthContext);

    const toggleOnClick= ()=>{
        setLogin(!isLogin);
    } 

    

    return (<>
      <div>
               <ButtonGroup  aria-label="Basic button group">
                  <Button onClick={()=>toggleOnClick()} variant={isLogin ? "contained":"outlined"}>Login</Button>
                  <Button  onClick={()=>toggleOnClick()} variant={isLogin ?"outlined": "contained"}>Register</Button>
                 
                </ButtonGroup><br/>

       <TextField id="filled-basic" label="username" style={{color:"white",borderColor:"white"}} onChange={(e)=>{setUsername(e.target.value)}} variant="filled" /><br/>
     <TextField id="filled-basic" label="Password"  type="password" onChange={(e)=>{setPassword(e.target.value)}} variant="filled" /><br/>
  { !isLogin &&   <TextField id="filled-basic" label="email"  onChange={(e)=>{setEmail(e.target.value)}} variant="filled" />}<br/>
       <Button variant='contained' onClick={isLogin?()=>{handleLogin(username,password)}:()=>handleRegister(username,password,email)}>{isLogin?"login":"Register"}</Button>
      </div>
     <p style={{color:"red"}}>{error}</p> 
       </>)

   
}

export default Login;