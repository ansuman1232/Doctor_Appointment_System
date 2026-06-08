


import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router';

export const AuthContext = createContext({});

// 1. Create custom Axios instances
export const api = axios.create({
    baseURL: "http://localhost:3000/api/v1",
});

export const apiPrivate = axios.create({
    baseURL: "http://localhost:3000/api/v1",
    withCredentials: true, // Required to send and receive HttpOnly cookies
});

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [accessToken, setAccessToken] = useState(null); // Keep strictly in memory
    const [userId,setUserId]=useState("");
    const [error, setError] = useState("");
    const route = useNavigate();

    // Clear error notices automatically after 3 seconds
    useEffect(() => {
        if (!error) return;
        const timer = setTimeout(() => setError(""), 3000);
        return () => clearTimeout(timer);
    }, [error]);

    // 2. Manage Axios Interceptors dynamically when the access token updates
    useEffect(() => {
        // Interceptor 1: Attach Access Token to all outgoing private requests
        const requestIntercept = apiPrivate.interceptors.request.use(
            (config) => {
                if (!config.headers['Authorization'] && accessToken) {
                    config.headers['Authorization'] = `Bearer ${accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Interceptor 2: Handle 403 Forbidden (Expired Token) and refresh silently
        const responseIntercept = apiPrivate.interceptors.response.use(
            (response) => response,
            async (error) => {
                const prevRequest = error?.config;
                
                // If backend throws 403 and we haven't already retried this specific request
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    try {
                        // Call refresh endpoint (browser automatically sends the HttpOnly cookie)
                        const response = await apiPrivate.post('/refresh-token');
                        const newAccessToken = response.data.accessToken;

                        setAccessToken(newAccessToken);
                        prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        
                        return apiPrivate(prevRequest); // Retry the original request
                    } catch (refreshError) {
                        // Refresh token expired or invalid -> Force logout
                        setIsLoggedIn(false);
                        setAccessToken(null);
                        route("/login");
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );

        // Cleanup interceptors when dependencies change to prevent memory leaks
        return () => {
            apiPrivate.interceptors.request.eject(requestIntercept);
            apiPrivate.interceptors.response.eject(responseIntercept);
        };
    }, [accessToken, route]);

    // 3. Updated Login Handler
    async function handleLogin(username, password) {
        try {
            const response = await api.post("/login", { username, password });
            
            if (response.status === 200) {
                const token = response.data.accessToken; // Read access token from JSON body
                setAccessToken(token);
                setIsLoggedIn(true);
                route("/dash");
            }
        } catch (e) {
            setError(e.response?.data?.msg || "Login failed. Please try again.");
        }
    }

    // 4. Added Logout Handler to clean up state and clear the backend cookie
    async function handleLogout() {
        try {
            await apiPrivate.post('/logout');
        } catch (e) {
            console.error("Logout error on server:", e);
        } finally {
            setAccessToken(null);
            setIsLoggedIn(false);
            route("/login");
        }
    }


     //==============handle register==================
    let  handleRegister = async (username,password,email)=>{

         try {
            const response = await api.post("/register", { username, password ,email});
              const response1 = await api.post("/login", { username, password });
            if (response1.status === 200) {
                const token = response1.data.accessToken; // Read access token from JSON body
                setAccessToken(token);
                setIsLoggedIn(true);
                route("/dash");
            }
        } catch (e) {
            setError(e.response1?.data?.msg || "Login failed. Please try again.");
        }


    }


    // Memoize the context value to optimize re-renders
    const contextValue = useMemo(() => ({
        isLoggedIn, 
        setIsLoggedIn, 
        handleLogin, 
        handleLogout, 
        handleRegister,
        error
    }), [isLoggedIn, error]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}


