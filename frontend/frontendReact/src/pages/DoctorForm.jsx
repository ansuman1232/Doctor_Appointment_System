import NavMenu from "../utils/NavMenu";
import axios from 'axios'
import { AuthContext } from "../context/AuthContext";
import { useContext,useState,useEffect } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

function DoctorForm(){
  const {userId}=useContext(AuthContext)
  const [spec,setSpec]=useState("");
  const [exp,setExp]=useState(0);
  const [cost,setCost]=useState(0);
  const [quali,setQuali]=useState('');
  const [error,setError]=useState('');
  const [res,setRes]=useState('');
  const [day,setDay]=useState('');
  const [slotStart,setSlotStart]=useState('');
  const [slotEnd,setSlotEnd]=useState('');
const[contact,setContact]=useState('');
   useEffect(()=>{setTimeout(()=>{setError("");setRes("")},4000)},[error,res])


  const [avail, setAvail] = useState({
   'Monday': {   slots: [] },
  'Tuesday' : {   slots: [] },
     'Wednesday': {   slots: [] },
   'Thrusday': {   slots: [] },
   'Friday': {   slots: [] },
   'Saturday': {   slots: [] },
   'Sunday': {   slots: [] }
  
});
  const handleClick= async ()=>{

    try{
    let response=await axios.post("http://localhost:3000/api/v1/create-doctor-application", {contact,userId,spec,cost,exp,quali,avail})
   setRes(response.data.message)
   console.log(response.data.message)
  }
    catch(e){
      setError(e.response.data.error)
      console.log(e.response.data.error);
    }
  }


  const addSlot = () => {
    const updated = {...avail};
    let slot=`${slotStart}-${slotEnd}`
    updated[day].slots.push(slot);
    
    setAvail(updated);
    console.log(avail)
  };

  
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
          required
          id="outlined-required"
          label="contact number"
          value={contact}
          onChange={(e)=>setContact(e.target.value)}
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
        /> <br/> <br/>
      
      <InputLabel id="demo-simple-select-autowidth-label">Day</InputLabel>
      <Select
        labelId="demo-simple-select-autowidth-label"
        id="demo-simple-select"
          value={day}
          onChange={(e)=>{setDay(e.target.value)}}
          minWidth="10vw"
          label="Day"
         
        >
          <MenuItem value="">
            <em>Day</em>
          </MenuItem>
          <MenuItem value={"Monday"}>Monday</MenuItem>
          <MenuItem value={"Tuesday"}>Tuesday</MenuItem>
          <MenuItem value={"Wednesday"}>Wednesday</MenuItem>
          <MenuItem value={"Thrusday"}>Thrusday</MenuItem>
          <MenuItem value={"Friday"}>Friday</MenuItem>
          <MenuItem value={"Saturday"}>Saturday</MenuItem>
          <MenuItem value={"Sunday"}>Sunday</MenuItem>
        </Select> 
        
        <Select
        labelId="demo-simple-select-autowidth-label"
        id="demo-simple-select"
          value={slotStart}
          onChange={(e)=>{setSlotStart(e.target.value)}}
          minWidth="10vw"
          label="start slot"
         
        >
          <MenuItem value="">
            <em>StartSlot</em>
          </MenuItem>
          <MenuItem value={"0"}>0</MenuItem>
          <MenuItem value={"1"}>1</MenuItem>
          <MenuItem value={"2"}>2</MenuItem>
          <MenuItem value={"3"}>3</MenuItem>
          <MenuItem value={"4"}>4</MenuItem>
          <MenuItem value={"5"}>5</MenuItem>
          <MenuItem value={"6"}>6</MenuItem>
          <MenuItem value={"8"}>8</MenuItem>
          <MenuItem value={"9"}>9</MenuItem>
          <MenuItem value={"10"}>10</MenuItem>
          <MenuItem value={"11"}>11</MenuItem>

          <MenuItem value={"12"}>12</MenuItem>
          <MenuItem value={"13"}>13</MenuItem>
          <MenuItem value={"14"}>14</MenuItem>
          <MenuItem value={"15"}>15</MenuItem>
          <MenuItem value={"16"}>16</MenuItem>
          <MenuItem value={"17"}>17</MenuItem>
          <MenuItem value={"18"}>18</MenuItem>
          <MenuItem value={"19"}>19</MenuItem>
          <MenuItem value={"20"}>20</MenuItem>
          <MenuItem value={"21"}>21</MenuItem>
          <MenuItem value={"22"}>22</MenuItem>
          <MenuItem value={"23"}>23</MenuItem>
          
        </Select>
       



        <Select
        labelId="demo-simple-select-autowidth-label"
        id="demo-simple-select"
          value={slotEnd}
          onChange={(e)=>{setSlotEnd(e.target.value)}}
          minWidth="10vw"
          label="slot end"
         
        >
          <MenuItem value="">
            <em>Slot end</em>
          </MenuItem>
          <MenuItem value={"0"}>0</MenuItem>
          <MenuItem value={"1"}>1</MenuItem>
          <MenuItem value={"2"}>2</MenuItem>
          <MenuItem value={"3"}>3</MenuItem>
          <MenuItem value={"4"}>4</MenuItem>
          <MenuItem value={"5"}>5</MenuItem>
          <MenuItem value={"6"}>6</MenuItem>
          <MenuItem value={"8"}>8</MenuItem>
          <MenuItem value={"9"}>9</MenuItem>
          <MenuItem value={"10"}>10</MenuItem>
          <MenuItem value={"11"}>11</MenuItem>

          <MenuItem value={"12"}>12</MenuItem>
          <MenuItem value={"13"}>13</MenuItem>
          <MenuItem value={"14"}>14</MenuItem>
          <MenuItem value={"15"}>15</MenuItem>
          <MenuItem value={"16"}>16</MenuItem>
          <MenuItem value={"17"}>17</MenuItem>
          <MenuItem value={"18"}>18</MenuItem>
          <MenuItem value={"19"}>19</MenuItem>
          <MenuItem value={"20"}>20</MenuItem>
          <MenuItem value={"21"}>21</MenuItem>
          <MenuItem value={"22"}>22</MenuItem>
          <MenuItem value={"23"}>23</MenuItem>
          
        </Select>

       <Button onClick={()=>{addSlot()}} variant="contained">Add</Button>


        
        <br/> 
      
     <Button onClick={()=>handleClick()} variant="contained">submit</Button>
    </div>
    {res && <p style={{color:"green"}}>{`${res}`}</p>}
    {error && <p style={{color:"red"}}>{`${error}`}</p>}
  </>)
}

export default DoctorForm;