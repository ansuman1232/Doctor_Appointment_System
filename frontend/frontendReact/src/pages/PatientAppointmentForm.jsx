import { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../context/AuthContext.jsx";
import {useNavigate,useLocation} from "react-router";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import Button from '@mui/material/Button';
import NavMenu from '../utils/NavMenu.jsx';

function PatientAppointmentForm(){
    const {state} = useLocation();
const { doctorId } = state;
 const {userId} =useContext(AuthContext);
 const [date,setDate]=useState(null);
 const[slot,setSlot]=useState();
 const[reason ,setReason]=useState('');
 const[res,setRes]=useState();
 const[error,setError]=useState();
 useEffect(()=>{setTimeout(()=>{setError("");setRes("")},4000)},[error,res])

 async function  clickHandler(){

    try{
        let response=await axios.post("http://localhost:3000/api/v1/create_appointment", {doctorId,patientId:userId,date,slot, symptoms:reason})
       setRes(response.data.message)
       console.log(response.data.message)
      }
        catch(e){
          setError(e.response.data.error)
          console.log(e.response.data.error);
        }


 }



    return(
        <>
        <div>
        <NavMenu />


        <DatePicker label="Basic date picker" onChange={ setDate} value={date}/>
        <p style={{ color: "black" }}>
        {date ? date.format('YYYY-MM-DD') : "No date selected"}</p>
        <Select
       
        labelId="demo-simple-select-autowidth-label"
        id="demo-simple-select"
          value={slot}
          onChange={(e)=>{setSlot(e.target.value)}}
         
          label=" slot"
         
        >
          <MenuItem value="">
            <em>Slot</em>
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
          
          <br/>
        <textarea value={reason} placeholder='enter your reason to meet doctor or write your symptoms' onChange={(e)=>{setReason(e.target.value)}}  rows={4} cols={40} />
        <br/>
        <Button variant='contained' onClick={()=>{clickHandler()}} >Submit</Button>
        </div> 

        {res && <p style={{color:"green"}}>{`${res}`}</p>}
        {error && <p style={{color:"red"}}>{`${error}`}</p>}
        </>
    )
}


export default PatientAppointmentForm;