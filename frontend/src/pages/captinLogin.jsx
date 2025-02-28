import React, { useEffect, useState } from 'react'
import {Link,useNavigate} from 'react-router-dom'
import axios from 'axios';
import { CaptinContext } from '../context/captinContext';
import './Login.css'
const captinLogin = () => {
    let navigate = useNavigate();
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const {captin,setCaptin} = React.useContext(CaptinContext)
  useEffect(()=>{
    console.log("captin useeffect: ",captin)
  })
    async function submitHandler(e){
        e.preventDefault();
        console.log("email: ",email)
        console.log("password: ",password)
        const InputCaptin = {
            email,
            password
        }
        const baseUrl = import.meta.env.VITE_BASE_URL;
        let response = await axios.post(`${baseUrl}/captin/login`,InputCaptin)
        if(response.status == 200){
            navigate('/captinHome')
            console.log("response: ",response)
            setCaptin(response.data.loggedIncaptin)
            localStorage.setItem('token',response.data.token)
        }

    }
  
    return (
    <div id='log'>
        <div className='uberLogo'>
            <img src='/images/Uber_logo.png'/>
        </div>
        <form onSubmit={(e)=>{submitHandler(e)}} className='loginForm'>
            <div className='emailSection'>
                <label>What is your email</label>
                <input onChange={(e)=>{setEmail(e.target.value)}} value={email} type='email' placeholder='abc@gmail.com'/>
            </div>
            <div className='passSection'>
                <label>Enter password</label>
                <input onChange={(e)=>{setPassword(e.target.value)}} value={password} type='password'/>
             </div>
            <button type='submit' className='loginButton'>
                  Login
            </button>
            <p>New Here? <Link to='/captinSignup'>Create New Account</Link></p>
        </form>
        <Link to={'/userLogin'} className='signAsUser'>Sign in as User</Link>
    </div>
  )
}

export default captinLogin