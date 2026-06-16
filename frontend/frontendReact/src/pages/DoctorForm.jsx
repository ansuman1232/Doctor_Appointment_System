import NavMenu from "../utils/NavMenu";
import axios from 'axios'
import { AuthContext } from "../context/AuthContext";
import { useContext,useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function DoctorForm(){
  const {userId}=useContext(AuthContext)
  const [spec,setSpec]=useState("");
  const [exp,setExp]=useState(0);
  const [cost,setCost]=useState(0);
  const [quali,setQuali]=useState('');
  const [error,setError]=useState('');
  const [res,setRes]=useState('');

  const handleClick= async ()=>{

    try{
    let response=await axios.post("http://localhost:3000/api/v1/create-doctor-application", {userId,spec,cost,exp,quali})
   setRes(response.data.message)
   console.log(response.data.message)
  }
    catch(e){
      setError(e.response.data.error)
      console.log(e.response.data.error);
    }
  }

  
  return(<>
   <h1>Doctor form</h1>
   <NavMenu/>
    <div>
    <TextField
          required
          id="outlined-required"
          label="experience"
          value={exp}
          onChange={(e)=>setExp(e.target.value)}
        />
    

       <TextField
          required
          id="outlined-required"
          label="specialization"
          value={spec}
          onChange={(e)=>setSpec(e.target.value)}
        />  

      <TextField
         placeholder="Link of resume"
          id="outlined-required"
          label="qualification"
          value={quali}
          onChange={(e)=>setQuali(e.target.value)}
        />


        <TextField
          required
          id="outlined-required"
          label="Cost"
          value={cost}
          onChange={(e)=>setCost(e.target.value)}
        /> <br/>
      
     <Button onClick={()=>handleClick()} variant="contained">submit</Button>
    </div>
  </>)
}

export default DoctorForm;