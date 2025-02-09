import React, { createContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import axios from "axios";

export const appContext = createContext(null);

export const ConProvider = (props) => {
    const [userState, setUserState] = useState('Logged-Out');
    const [note, setNote] = useState('');
    const [token, setToken] = useState(Cookies.get("token"));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // console.log(userState)

    useEffect(() => {
        const token = Cookies.get("token");
        const userId = Cookies.get("userId");
        if (token && userId) {
            setUserState("Logged-In");
            setToken(token);
            fetchUserDetails(userId);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUserDetails = async (userId) => {
        try {
            const response = await axios.get(`https://note-taker-bdon.onrender.com/user/${userId}`);
            const userData = response.data;
            setUser(userData);
        } catch (error) {
            console.error('Error fetching user details:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = (newToken, userData) => {
        if (newToken && userData) {
            setToken(newToken);
            setUser(userData);
            setUserState("Logged-In");
            Cookies.set("token", newToken, { expires: 7 });
            Cookies.set("userId", userData.userId, { expires: 7 });
        } else {
            console.log("No valid token or user data provided for login.");
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setUserState('Logged-Out');
        Cookies.remove("token");
        Cookies.remove("userId");
        window.location.reload();
    };



    return (
        <appContext.Provider value={{ userState, setUserState, token, user, login, logout, loading, note, setNote }}>
            {props.children}
        </appContext.Provider>
    );
};
