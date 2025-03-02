import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPass = () => {
    const [newPass, setNewPass] = useState('');
    const [retype, setRetype] = useState('');
    let location = useLocation();
    //useEffect(()=>{
       let navigate = useNavigate()
        async function changePass(e){
            e.preventDefault(); 
            //console.log("location: ",location.state)
            let email = location.state?.email;
            if(newPass == retype){
                let response = await axios.post(`${import.meta.env.VITE_BASE_URL}/forgot/changePass`,{email:email,newPass:newPass})
                console.log("response.data.status: ",response.data)
                if(response.data.status==200){
                    navigate('/userLogin')
                }
            
        }
        // changePass()
    }
    
    return (
        <div id="log">
            <div className="uberLogo">
                <img src="/images/Uber_logo.png" alt="Uber Logo" />
            </div>
            {/* onSubmit={(e)=>{changePass(e)}} */}
            <form onSubmit={(e)=>{changePass(e)}} method="POST" className="loginForm">
                <div className="passSection">
                    <label htmlFor="newPassword">New password</label>
                    <input 
                        id="newPassword" 
                        name="newPassword" 
                        type="password" 
                        value={newPass} 
                        onChange={(e) => setNewPass(e.target.value)} 
                        required 
                    />

                    <label htmlFor="retypePassword">Re-Enter password</label>
                    <input 
                        id="retypePassword" 
                        name="retypePassword" 
                        type="password" 
                        value={retype} 
                        onChange={(e) => setRetype(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit" className="loginButton">Reset Password</button>
            </form>
        </div>
    );
}

export default ResetPass;
