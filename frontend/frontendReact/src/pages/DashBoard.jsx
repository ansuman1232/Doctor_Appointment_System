

import NavMenu from "../utils/NavMenu";
import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { useNotification } from '../utils/useNotification.jsx';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router";
export const api = axios.create({
    baseURL: "http://localhost:3000/api/v1",
});

import { io } from 'socket.io-client';
const socket = io('http://localhost:3000/');

function DashBoard() {
  const [data, setData] = useState([]);
  const { userId } = useContext(AuthContext);
  



  const navigate = useNavigate();

  // NEW PANEL VISIBILITY STATE
  const [isOpen, setIsOpen] = useState(false);

  // Doctor List Retrieval
  useEffect(() => {
    async function fun() {
      try {
        const res = await api.get("/get_doctor");
        setData([...res.data.data]);
      } catch (e) {
        console.error(e);
      }
    }
    fun();
  }, []);

  // Notifications State Management
  const { notifications, setNotifications } = useNotification(userId);

  // DYNAMIC UNREAD COUNT CALCULATION
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Toggle dropdown and clear notifications counter instantly
  const toggleNotificationPanel = async () => {
    setIsOpen(!isOpen);

    // If opening panel and unread notifications exist, update status to read
    if (!isOpen && unreadCount > 0) {
      try {
        // Optimistic UI state cleanup update
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

        // Send confirmation backend API call
        await api.post(`/notifications/mark-read`, { userId });
      } catch (err) {
        console.error("Could not update backend read markers", err);
      }
    }
  };

  // Real-time Doctor List Updates
  useEffect(() => {
    socket.on("doctor_list_updated", (updatedDoctor) => {
      setData((prevData) => 
        prevData.map((doctor) => doctor._id === updatedDoctor._id ? updatedDoctor : doctor)
      );
    });

    socket.on("new_doctor_added", (newDoctor) => {
      setData((prevData) => [...prevData, newDoctor]);
    });

    return () => {
      socket.off("doctor_list_updated");
      socket.off("new_doctor_added");
    };
  }, []);

  return (
    <>
      <NavMenu />
         
      {/* BELL CONTAINER */}
      <div className="relative" style={{ margin: "20px", display: "inline-block" }}>
        <button 
          onClick={toggleNotificationPanel} 
          className="p-2 bg-gray-200 rounded-full" 
          style={{ position: 'relative', cursor: 'pointer', border: 'none', borderRadius: '50%', padding: '10px' }}
        >
          <NotificationImportantIcon sx={{ color: "crimson" }} /> 
          
          {/* BADGE COUNT */}
          {unreadCount > 0 && (
            <span 
              style={{
                position: 'absolute', top: '-5px', right: '-5px',
                backgroundColor: 'red', color: 'white', borderRadius: '50%',
                padding: '2px 6px', fontSize: '10px', fontWeight: 'bold'
              }}
            >
              {unreadCount}
            </span>
          )}
        </button>

        {/* DROPDOWN OVERLAY BOX */}
        {isOpen && (
          <div 
            style={{
              position: 'absolute', right: 0, top: '45px', width: '300px',
              backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px',
              boxShadow: '0px 4px 12px rgba(0,0,0,0.15)', zIndex: 100, maxHeight: '400px', overflowY: 'auto'
            }}
          >
            <div style={{ padding: '10px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>
              Notifications
            </div>
            
            {notifications.length === 0 ? (
              <p style={{ padding: '15px', color: '#666', textAlign: 'center', margin: 0 }}>No alerts found</p>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n._id} 
                  style={{
                    padding: '12px', borderBottom: '1px solid #f9f9f9',
                    fontSize: '13px', color: '#333', backgroundColor: n.isRead ? '#fff' : '#f0f7ff'
                  }}
                >
                  {n.message}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* DOCTORS GRID */}
      <div style={{ position: "relative", left: "10vw", display: "grid", gridTemplateColumns:"2fr 2fr", gap: "10px" }}>
        {data.length > 0 && data.map((e) => { 
          if (e.role === "doctor") {
            return (
              <div onClick={()=>{navigate("/patient_appointment",{ state: { doctorId: `${e._id}`} })}} key={e._id} style={{ color: "black", border: "2px solid black", padding: "10px", borderRadius: "8px", minWidth: "10vw" }}>
                <p><strong>Name:</strong> {e.name}</p>
                <p><strong>Specialization:</strong> {e.specialization}</p>
               {e.contact && <p><strong>Contact Number:</strong> {e.contact}</p>}
                <p><strong>Availability:</strong></p>
                {e.availability && e.availability.length > 0 && e.availability.map((d, index) => (
                  <div key={index} style={{ fontSize: "12px" }}>
                    <p style={{ margin: "2px 0" }}>{d.day}:</p>
                    {d.slots && d.slots.map((t, idx) => <span key={idx}>{t}{idx < d.slots.length - 1 ? ', ' : ''}</span>)}
                  </div>
                ))}
              </div>
            );
          }
          return null;
        })}
      </div>
    </>
  );
}

export default DashBoard;
