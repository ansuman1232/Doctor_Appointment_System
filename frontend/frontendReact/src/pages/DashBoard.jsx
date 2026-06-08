import NavMenu from "../utils/NavMenu";
import axios from 'axios';
import {useState,useEffect} from 'react';

// 1. Create custom Axios instances
export const api = axios.create({
    baseURL: "http://localhost:3000/api/v1",
});


function DashBoard(){
 const [data,setData]=useState([]);
 useEffect( ()=>{

 async function  fun(){
  try{
  const res=await api.get("/get_doctor")

     setData(res.data.data)
    
  }catch(e){
    console.log(e);
  }
}
fun()
 },[])

    
    return(<>
    <NavMenu/>
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