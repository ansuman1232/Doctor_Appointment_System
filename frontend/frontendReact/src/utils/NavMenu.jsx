
import { useNavigate } from 'react-router';
import Button from '@mui/material/Button';
import {AuthContext} from "../context/AuthContext.jsx";
import { useState,useContext } from 'react';
function NavMenu(){
  const {username,handleLogout,role}=useContext(AuthContext)
   const [isOpen ,setIsOpen]=useState(true)
  const navigate=useNavigate();
  function openChange(){
    setIsOpen(!isOpen);
  }

    return (
        
        <div style={{position:"absolute",left:"2vw",top:"10vh"}}>
        {isOpen?
         <Button  variant="contained" onClick={()=>openChange()}>Open NavMenu</Button>
          :
          <div style={{color:"white"}}>
              <Button variant="contained" color="error" onClick={()=>openChange()}>X</Button>
              <Button variant="contained" color="warning" onClick={()=>handleLogout()}>Logout</Button>
           <h3>{`Username:${username}`}</h3>
           <div onClick={()=>navigate("/dash")}>Home</div>
          {role==="admin" &&  <div onClick={()=>navigate("/doctor_appointment_list")}>Doctor Appointment List</div>}
          {role==="doctor" &&  <div onClick={()=>navigate("/patient_appointment_approval")}>Patient Appointment Approval</div>}
             <div onClick={()=>navigate("/doctor_form")}>Apply for Doctor form</div>
             <div onClick={()=>navigate("/edit_form")}>Edit my Info</div>
             <div onClick={()=>navigate("/ai_chat")}>AI chat</div>
             <div onClick={()=>navigate("/invoice")}>pending invoice</div>
             <div onClick={()=>navigate("/my_appointment")}>My appointments</div>
          </div>   
       
          }
          </div>
       
    )
}


export default NavMenu;