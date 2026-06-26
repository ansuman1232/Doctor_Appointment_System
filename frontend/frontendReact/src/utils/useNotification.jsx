// hooks/useNotifications.js
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
const socket = io('http://localhost:3000/');

export const useNotification = (userId) => {
  const [notifications, setNotifications] = useState([]);

 // 1. Fetch persistent history from database on load
 useEffect(() => {
  if (!userId) return;

  const fetchNotificationHistory = async () => {
    try {
      // Adjust this URL to match your backend notification route
      const res = await axios.get(`http://localhost:3000/api/v1/notifications/${userId}`);
      setNotifications(res.data.notifications || res.data);
    } catch (err) {
      console.error("Failed to fetch notification history", err);
    }
  };

  fetchNotificationHistory();
}, [userId]);





   // 2. Real-time updates via WebSockets
   useEffect(() => {
    if (!userId) return;

    socket.emit('join_room', userId.toString());

    const handleIncomingNotification = (data) => {
      // Structure the data consistently with the DB (unread by default)
      const formattedNotification = {
        _id: data._id || Date.now().toString(), 
        message: data.message,
        isRead: false,
        createdAt: new Date()
      };
      setNotifications((prev) => [formattedNotification, ...prev]);
    };

    socket.on('new_notification', handleIncomingNotification);
    socket.on('admin_decision', handleIncomingNotification);
     socket.on('doctor_application',handleIncomingNotification);
     socket.on('new_appointment_request', handleIncomingNotification);
    return () => {
      socket.off('new_notification', handleIncomingNotification);
      socket.off('admin_decision', handleIncomingNotification);
      socket.off('doctor_application',handleIncomingNotification);
      socket.off('new_appointment_request', handleIncomingNotification);
    };
  }, [userId]);

  return { notifications, setNotifications };
};


