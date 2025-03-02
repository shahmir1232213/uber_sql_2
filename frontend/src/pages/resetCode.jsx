import React, { useState } from 'react';
import { useLocation, useNavigate,Link } from 'react-router-dom';
import axios from 'axios';

const ResetCode = () => {
  const [code, setCode] = useState('');
  let location = useLocation();
  let navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    let response = await axios.post(`${import.meta.env.VITE_BASE_URL}/forgot/code/verify`,{code:location.state?.code,input:code})
    if(response.data.status == 200){
        navigate('/resetPass', { state: {email:location.state.email} });
    }
};

  return (
    <div id='log'>
      <div className="uberLogo">
        <img src="/images/Uber_logo.png" alt="Uber Logo" />
      </div>
      <form onSubmit={handleSubmit} className="loginForm">
        <div className="passSection">
          <label htmlFor="code">Enter Code</label>
          <input 
            id="code" 
            name="code" 
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}  
          />
        </div>
        <p>We have sent a code to your email address</p>
        <button type="submit" className="loginButton">Submit</button>
      </form>
      <Link to={'/userLogin'} className='signAsCaptin'>Remembered Credentials ?</Link>
    </div>
  );
}

export default ResetCode;
