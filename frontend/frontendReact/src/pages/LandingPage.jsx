import Button from '@mui/material/Button';
import { Link } from 'react-router';

function LandingPage() {
  let style1={
     backgroundImage:`url("./landingpageImage.webp")`,
     height:"100vh",
     backgroundSize:"cover"
   }  

  return (
    <>
    <div style={style1}>
     <div style={{justifyContent:"end",display:"flex"}}> <Link to="/dash">Home</Link><Link to="/login">login</Link></div>
         <Button variant="contained" color="success" style={{position:"relative",top:"70vh" ,left:"40vw"}}>
           <Link to="/dash" style={{textDecoration:"none" ,color:"white"}}> {"Next ->"} </Link>
           </Button>
    </div>
    
    </>
  )
}

export default LandingPage;
