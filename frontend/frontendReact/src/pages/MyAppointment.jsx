import { useEffect,useState,useContext } from "react";
import axios from 'axios';
import {AuthContext} from '../context/AuthContext.jsx'
import NavMenu from "../utils/NavMenu.jsx";
 function MyAppointment(){
   const [appointments,setAppointments]=useState([]);
    const {userId} =useContext(AuthContext)
   useEffect(()=>{
    async function fetch(){
       try{
         let res= await axios.get(`http://localhost:3000/api/v1/my-appointment/${userId}`)
         console.log(res)
         setAppointments([...res.data.appointments])
         console.log(appointments.length)
       }
       catch(e){
        console.log(e);
       }
    }
    fetch();
   },[userId])

    return (<>
        <NavMenu/>
   {


   
  appointments.length>0 ? appointments.map(e=><div key={e._id} style={{color:"black",marginBottom:"3vw"}}>
    <p>DoctorId: {e.doctorId}</p>
    <p>Slot: {e.slot}</p>
    <p>Date:{e.date}</p>
    <p>Symptoms:{e.symptoms}</p>
    <p>status :{e.status}</p>
   </div>) 
   
   : <div style={{color:"black",marginBottom:"3vw"}}>No Appointments</div>
    
   }
    </>)

}

export default MyAppointment;



