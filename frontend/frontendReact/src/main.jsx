import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from "react-router";
import DashBoard from './pages/DashBoard.jsx';
import Login from './pages/Login.jsx';
import {AuthProvider}  from './context/AuthContext.jsx';
import { ProtectedRoute } from './utils/ProtectedRoute.jsx';
import AIChat from "./pages/AIChat.jsx";
import Invoice from './pages/Invoice.jsx';
import EditForm from "./pages/EditForm.jsx";
import DoctorForm from "./pages/DoctorForm.jsx";
import DoctorAppointmentList from './pages/DoctorAppointmentList.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
  
      <BrowserRouter>
        <AuthProvider>
    <Routes>
      <Route path="/" element={<App />} />

      <Route path="/dash" element={
        <ProtectedRoute>
        <DashBoard/>
        </ProtectedRoute>
        }/>



      <Route path="/doctor_form" element={
        <ProtectedRoute>
        <DoctorForm/>
        </ProtectedRoute>
        }/>


       <Route path="/edit_form" element={
        <ProtectedRoute>
        <EditForm/>
        </ProtectedRoute>
        }/>

        <Route path="/ai_chat" element={
        <ProtectedRoute>
        <AIChat/>
        </ProtectedRoute>
        }/>

         <Route path="/doctor_appointment_list" element={
        <ProtectedRoute>
        <DoctorAppointmentList/>
        </ProtectedRoute>
        }/>
        

        <Route path="/invoice" element={
        <ProtectedRoute>
        <Invoice/>
        </ProtectedRoute>
        }/>

 
      <Route path="/login" element={<Login/>}/>
    </Routes>
    </AuthProvider>
  </BrowserRouter>

  </StrictMode>,
)
