import {useState} from 'react';
import { useNavigate } from 'react-router';
import Button from '@mui/material/Button';

function NavMenu(){
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
          <div>
              <Button variant="contained" color="error" onClick={()=>openChange()}>X</Button>
           <h3>Username:</h3>
             <div onClick={()=>navigate("/appointment_list")}>Appointment List</div>
             <div onClick={()=>navigate("/doctor_form")}>Apply for Doctor form</div>
             <div onClick={()=>navigate("/edit_form")}>Edit my Info</div>
             <div onClick={()=>navigate("/ai_chat")}>AI chat</div>
             <div onClick={()=>navigate("/invoice")}>pending invoice</div>
          </div>   
       
          }
          </div>
       
    )
}


export default NavMenu;