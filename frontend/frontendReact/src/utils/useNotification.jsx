// hooks/useNotifications.js
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000/');

export const useNotification = (userId) => {
  const [notifications, setNotifications] = useState([]);


  useEffect(() => {
    if (!userId) return;

    socket.emit('join_room', userId.toString());

     // Generic function to append incoming payloads
     const handleIncomingNotification = (data) => {
      setNotifications((prev) => [data, ...prev]);
    };

    // Attach listeners
    socket.on('new_notification', handleIncomingNotification);
    socket.on('admin_decision', handleIncomingNotification);


   

    return () => {
      socket.off('new_notification', handleIncomingNotification);
      socket.off('admin_decision', handleIncomingNotification);
    };
  }, [userId]);

  return { notifications, setNotifications };
};
