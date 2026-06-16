import NavMenu from "../utils/NavMenu";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import {useState,useEffect} from 'react';
import axios from "axios";
import Button from "@mui/material/Button";

function AIChat(){
  const [userInput,setUserInput]=useState("");
   const [res, setRes] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
   
    useEffect(()=>{setTimeout(()=>setError(""),3000)},[error])


   async function onSubmit(){
    try{
      setLoading(true)
       let response=await axios.post("http://localhost:3000/api/v1/chatbot", {userInput})
       console.log(response);
       setLoading(false)
       setRes(response.data)
    }
    catch(e){
      
      setError(e.response.data.message)
      setLoading(false)
    }
   }



  return(
    <>
    <NavMenu/>
    <div style={{postion:"relative",left:"10vh"}}>
    <h1>AIChat</h1>
    <TextareaAutosize
  aria-label="minimum height"
  minRows={4}
  placeholder="Please enter your symptoms"
  onChange={(e)=>setUserInput(e.target.value)}
  value={userInput}
  style={{ width: "70vw" }}
/><br/>
 <Button variant="contained" onClick={()=>{onSubmit()}}>Send</Button>
  {loading && <h2>Analysing...</h2>}
 {error && <h3 style={{color:"red"}}>{error}</h3>}
 {res &&
 
 <div style={{color:"white"}}>
 <p>{`emergency: ${res.is_emergency}`}</p>
 <p>{`detected symptoms: ${res.detected_symptoms}`}</p>
 <p>{`predicted condition: ${res.predicted_condition}`}</p>
 <p>{`detected symptoms: ${res.detected_symptoms}`}</p>
 <p>{`confidence level: ${res.confidence_level}`}</p>
 <p>{`recommended specialist: ${res.recommended_specialist}`}</p>
 <p>{`next steps: ${res.next_steps}`}</p>
<p>{`disclaimer: ${res.medical_disclaimer}`}</p>
 <Button variant="contained" onClick={()=>{setRes()}}>Reset</Button>
 </div>
 }
    </div>
    </>
  )
}

export default AIChat;