import React, { use, useEffect, useState } from 'react'
import {Link,useNavigate} from 'react-router-dom'
import './signUp.css'
import {UserDataContext} from '../context/userContext'
import axios from 'axios'
const userSignup =  () => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [userData,setUserData] = useState({})
    const [fname,setfName] = useState('')
    const [lname,setlName] = useState('')

    const {user,setUser} = React.useContext(UserDataContext)
    
    useEffect(()=>{
        console.log("User context api: ",user)
    })
    let navigate = useNavigate()
   async function submitHandler(e){
        e.preventDefault();
        // console.log("email: ",email)
        // console.log("password: ",password)
        // console.log("First name: ",fname)
        // console.log("Last name: ",lname)
        setUserData({
            email:email,
            password:password,
            fullName:{
                firstName:fname,
                lastName:lname,
            }
        })
        // ek tarah ka req.body
        let newUser = {
            email:email,
            password:password,
            fullname:{
                firstName:fname,
                lastName:lname,
            }
        }
        const baseUrl = import.meta.env.VITE_BASE_URL;
        //console.log("baseUrl:",baseUrl);
       console.log("new user: ",newUser)
        const response = await axios.post(`${baseUrl}/user/register`,newUser)
        if(response.status == 201){
            console.log("response: ",response)
            let user = response.data.user;
            setUser(user);
            localStorage.setItem('token',response.data.token)
            navigate('/home')
        }
    }
  
    return (
    <div id='log'>
        <div className='uberLogo'>
            <img src='/images/Uber_logo.png'/>
        </div>
        <form onSubmit={(e)=>{submitHandler(e)}} className='loginForm'>
            <div className='nameSection'>
                <label>What is your name</label>
                <input onChange={(e)=>{setfName(e.target.value)}} className='name' value={fname} type='text' placeholder='first name'/>
                <input onChange={(e)=>{setlName(e.target.value)}} className='name' value={lname} type='text' placeholder='last name'/>
            </div>
            <div className='emailSection'>
                <label>What is your email</label>
                <input onChange={(e)=>{setEmail(e.target.value)}} value={email} type='email' placeholder='abc@gmail.com'/>
            </div>
            <div className='passSection'>
                <label>Enter password</label>
                <input onChange={(e)=>{setPassword(e.target.value)}} value={password} type='password'/>
             </div>
            <button type='submit' className='loginButton'>
                  Create Account
            </button>
            <p>Already have an account? <Link to={'/userLogin'}>Login Here</Link></p>
        </form>
    </div>
  )
}

export default userSignup