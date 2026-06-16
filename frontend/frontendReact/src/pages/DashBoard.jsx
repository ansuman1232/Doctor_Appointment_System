import NavMenu from "../utils/NavMenu";
import axios from 'axios';
import {useState,useEffect, useContext} from 'react';
import { useNotification } from '../utils/useNotification.jsx';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import { AuthContext } from "../context/AuthContext.jsx";

// 1. Create custom Axios instances
export const api = axios.create({
    baseURL: "http://localhost:3000/api/v1",
});



import { io } from 'socket.io-client';
const socket = io('http://localhost:3000/');




function DashBoard(){
 const [data,setData]=useState([]);
 const {userId} =useContext(AuthContext)
 //=======for doctor lists=======================
 useEffect( ()=>{

 async function  fun(){
  try{
  const res=await api.get("/get_doctor")

     setData([...res.data.data])
     console.log(notifications)
  }catch(e){
    console.log(e);
  }
}
fun()
 },[])

//===========================================for notification========

 const { notifications, setNotifications } = useNotification(userId);

// useEffect(() => {
//   const fetchHistory = async () => {
//     const res = await axios.get(`/api/notifications/${userId}`);
//     setNotifications(res.data);
//   };
//   fetchHistory();
// }, [userId, setNotifications]);

// const unreadCount = notifications.filter(n => !n.isRead).length;
const unreadCount=0;


  // 2. REAL-TIME UPDATE LISTENER (Listens safely for backend triggers)
  useEffect(() => {
    // Listen for a custom event when a doctor's availability or info updates
    socket.on("doctor_list_updated", (updatedDoctor) => {
      setData((prevData) => 
     [...prevData.map((doctor) => 
          doctor._id === updatedDoctor._id ? updatedDoctor : doctor
        )]
      );
    });

    // Listen for a custom event if a completely new doctor is added
    socket.on("new_doctor_added", (newDoctor) => {
      setData((prevData) => [...prevData, newDoctor]);
    });

    // Cleanup listeners on component unmount
    return () => {
      socket.off("doctor_list_updated");
      socket.off("new_doctor_added");
    };
  }, []); // Bound safely to connection lifespan






    
    return(<>
    <NavMenu/>
         
    <div className="relative">
      <button className="p-2 bg-gray-200 rounded-full">
     < NotificationImportantIcon sx={{ color: "pink[500]" }} /> {unreadCount > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 text-xs">{unreadCount}</span>}
      </button>
    </div>

     <div style={{position:"relative",left:"30vw",display:"flex",flexWrap:"wrap"}} >
       
      {data.length>0 && data.map(
        (e) => { 
          console.log(e.role==='doctor');
           
         { if(e.role==="doctor"){
          return(
          <div key={`${e._id}`} style={{color:"white",border:"2px solid black" ,height:"20vh"}}>
         <p>name: {`${e.name}`}</p>
           <p>spcialization:  {`${e.specialization}`}</p>
           <p>availability: </p>
           {e.availability.length>0 &&
            e.availability.map(
              (d)=>{
                return (
                  <div>
                  <p>{`${d.day}:`}</p>
               {    d.slot.map((t)=>{
                     return(
                     <span>{`${t},`}</span>
                     )
                   }) }
                  </div>
                )
              }
            )
           }

         </div>
          )
          }
        }
      }
       ) 
          
      }
     </div>
    </>);
}


export default DashBoard;