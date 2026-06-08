import React, { useContext } from 'react';
import { Navigate,Route,useNavigate ,useLocation } from 'react-router';
import { AuthContext } from '../context/AuthContext'; // Match your file structure

export function ProtectedRoute({ children }) {
    const { isLoggedIn } = useContext(AuthContext);
    const location = useLocation();
  
    if (!isLoggedIn) {
        // Redirect them to login, but save the current location they were trying to go to
    
        return  <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}
