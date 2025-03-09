import React, { useContext, useEffect, useState } from 'react'
import {Link,useNavigate} from 'react-router-dom'
import { UserDataContext } from '../context/userContext'
import axios from 'axios'
import './Login.css'
const userLogin = () => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [userData,setUserData] = useState({});
    const [error,setError] = useState('')
    let navigate = useNavigate()
    const {user,setUser} = React.useContext(UserDataContext)
    async function submitHandler(e){
        e.preventDefault();
        setUserData({
            email:email,
            password:password
        })
        let newUser = {
            email:email,
            password:password
        } 
        const baseUrl = import.meta.env.VITE_BASE_URL;
       try{
        const response = await axios.post(`${baseUrl}/user/login`,newUser)
            console.log("respons Login: ",response.data)
            setUser(newUser);
            localStorage.setItem('token',response.data.token)
            console.log("response.token: ",response.data.token)
            navigate('/home')
       }
       catch(err){
            setError(err.response.data.error)
            
       }
    }
    useEffect(()=>{
        console.log("error: ",error)
    },[error])
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
             {error && <p>{error}</p>}
            <button type='submit' className='loginButton'>
                  Login
            </button>
            <p>New Here? <Link to={'/userSignup'}>Create New Account</Link></p>
        </form>
        <Link to={'/captinLogin'} className='signAsCaptin'>Sign in as Captin</Link>
    </div>
  )
}

export default userLogin