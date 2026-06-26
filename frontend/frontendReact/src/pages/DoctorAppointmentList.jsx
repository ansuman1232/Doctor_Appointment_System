import React, { useEffect, useState,useContext } from 'react';
import axios from 'axios';

import NavMenu from "../utils/NavMenu";
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
const socket = io('http://localhost:3000/');

function DoctorAppointmentList(){
    const {userId}=useContext(AuthContext)
    const [apps, setApps] = useState([]);
     
    useEffect(() => {
        
        axios.get('http://localhost:3000/api/v1/admin/doctor-applications?status=pending')
          .then(res =>{ setApps([...res.data.arr]);});
      }, []);



    //  useEffect(()=>{
    //   socket.emit('join_room',userId);
    //   socket.on('update_doctor_appointment_list',(id)=>{
    //        setApps((prevApps)=>{
            
    //         return prevApps.filter((apps)=>)

    //        })
    //   })
    // },[]) 






      const handleDecision = async (id, decision) => {
        try {
          await axios.put(`http://localhost:3000/api/v1/admin/doctor_applications/${id}`, { status: decision });
          
          setApps([...apps.filter(a => a._id !== id)]);
        } catch (err) {
          alert("Action failed");
        }
      };




    return(
    <>
    <NavMenu/>
    <div  className="p-6">
      <h2 className="text-xl font-bold mb-4">Doctor Applications</h2>
      {apps.map(app => (

         app.status==='pending' && (
        <div key={app._id} className="border p-4 mb-3 rounded shadow-sm bg-white">
          <h3 className="font-semibold">Specialization: {app.specialization}</h3>
          <p>Experience: {app.experience} years</p>
          <div className="mt-3 flex gap-2">
            <button 
              onClick={() => handleDecision(app._id, 'approved')}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Approve
            </button>
            <button 
              onClick={() => handleDecision(app._id, 'rejected')}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Reject
            </button>
          </div>
        </div>)
        
      
      ))}
    </div>

    </>)
}

export default DoctorAppointmentList;