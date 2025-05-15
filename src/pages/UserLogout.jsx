import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserLogout = () => {
    let token = localStorage.getItem('token');
    console.log("Token sent from frontend: ", token);  // Debugging
    let navigate = useNavigate();
    console.log("import.meta.env.VITE_BASE_URL: ", import.meta.env.VITE_BASE_URL);

    axios.post(`${import.meta.env.VITE_BASE_URL}/user/logout`, {}, {  // Correct way to send headers
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.status === 201) {
            localStorage.removeItem('token');
            navigate('/home');
        }
    })
    .catch(err => {
        console.log("Error: ", err.response?.data || err.message); // Improved error logging
    });

    return (
        <div>
            User Logged out
        </div>
    );
};

export default UserLogout;
