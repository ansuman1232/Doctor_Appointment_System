import NavMenu from "../utils/NavMenu";
import axios from "axios";
import {useState,useEffect,useContext} from 'react';
import { AuthContext } from "../context/AuthContext";
import { io } from 'socket.io-client';
const socket = io('http://localhost:3000/');


function PatientAppointmentApproval(){
   const [appointments,setAppointments]=useState();
   const {userId} =useContext(AuthContext);
    useEffect(()=>{
        async function fetchAllPendingAppointment(){
            let res=await axios.get(`http://localhost:3000/api/v1/get-all-pending-appointment/${userId}`)
     
            setAppointments(res.data.appointments);
            
        }
        fetchAllPendingAppointment();

    },[])


   useEffect(()=>{
         /*  Note:- here  socket.io is not required (can be done by moving logic of useEffect-socket.io of setAppointments() to handleDecision )


            When our frontend runs const socket = io('http://localhost:3000/'), it establishes a raw network connection. However, Socket.io does not automatically know who the logged-in user is or what room they belong to.
             If you do not call socket.emit("join_room", userId) from the frontend, your backend's connection listener block:
           "javascriptsocket.on('join_room', (userId) => {
           socket.join(userId); " // <--- This never executes!
         });
        Use code with caution....is never triggered. Because the client never joins the room, the backend's targeted .to(doctorId) message sails right past the client undetected
        
         */
    socket.emit("join_room", userId);
       socket.on("pending_patient_appointment_update",(id)=>{setAppointments((prevApps)=>{
        if(!prevApps)return [];
    
        return prevApps.filter(apps=>apps._id!=id)
       })})

      return ()=>{
       socket.off("pending_patient_appointment_update");
      }
    },[])

    const handleDecision=async (appId,status,patientId,symptoms)=>{
           try{
             let res=await axios.post(`http://localhost:3000/api/v1/pending-appointment`,{appId,status,patientId,symptoms})
           

           }catch(e){
            alert("Action failed");
            console.log(e);
           }
    }

    return(<div style={{color:"black"}}>
        <NavMenu/>
      {appointments && appointments.map(apps=>(  <div key={apps._id}>
        <p>PatientId :{`${apps.patientId}`}</p>
        <p>date :{`${apps.date.split("T")[0]}`}</p>
        <p>slot :{`${apps.slot}`}</p>
        <p>symptoms :{`${apps.symptoms}`}</p>
        <button 
              onClick={() => handleDecision(apps._id, 'confirmed',apps.patientId,apps.symptoms)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Approve
            </button>
            <button 
              onClick={() => handleDecision(apps._id, 'cancelled',apps.patientId,apps.symptoms)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Reject
            </button>
      </div>))

      }
    </div>)
}

export default PatientAppointmentApproval;