import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';

const UserForgotPass = () => {
    const [email, setEmail] = useState('');
    let navigate = useNavigate();

    async function getCode(e) {
        e.preventDefault(); 
        let response = await axios.post(`${import.meta.env.VITE_BASE_URL}/forgot/email/verify`, { email });
       // console.log("response.data: ", response.data);
        //navigate('/resetPass', { state: { code: response.data ,email:email} });
        navigate('/resetCode', { state: { code: response.data ,email:email} });
       //navigate('/resetCode', { state: {email:email} });
    }

    return (
        <div id="log">
            <div className="uberLogo">
                <img src="/images/Uber_logo.png" alt="Uber Logo" />
            </div>
            <form onSubmit={getCode} className="loginForm">
                <div className="emailSection">
                    <label htmlFor="email">Enter your email</label>
                    <input 
                        id="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        name="email" 
                        type="email" 
                        placeholder="abc@gmail.com" 
                        required 
                    />
                </div>
                <button type='submit' className="loginButton">Send Code</button>
            </form>
            <Link to={'/userLogin'} className='signAsCaptin'>Remembered Credentials ?</Link>
        </div>
    );
};

export default UserForgotPass;
