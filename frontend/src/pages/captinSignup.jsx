import React, { useState,useEffect } from 'react'
import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './captinSignup.css'
const captinSignup = () => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [captinData,setCaptinData] = useState({})
    const [fname,setfName] = useState('')
    const [lname,setlName] = useState('')
    
    const [vehicleColor, setVehicleColor] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [vehicleCapacity, setVehicleCapacity] = useState('');
    const [vehiclePlate, setVehiclePlate] = useState('');

    const [userData,setUserData] = useState({})

    useEffect(()=>{
        console.log("User state: ",userData)
    })

    let navigate = useNavigate();

   async function submitHandler(e){
        e.preventDefault();
        // console.log("email: ",email)
        // console.log("password: ",password)
        // console.log("First name: ",fname)
        // console.log("Last name: ",lname)

        setUserData({
            email:email,
            password:password,
            fullname:{
                firstName:fname,
                lastName:lname,
            },
            vehicle:{
                color:vehicleColor,
                capacity:vehicleCapacity,
                plate:vehiclePlate,
                vehicleType,
            }
        })
        // 
        const baseUrl = import.meta.env.VITE_BASE_URL;
        let response = await axios.post(`${baseUrl}/captin/register`,userData)
        if(response.status == 201){
            navigate('/captinHome')
            //console.log("response: ",response)
            localStorage.setItem('token',response.data.token)
        }
    }
  
    return (
    <div id='log'>
        <div className='uberLogo'>
            <img src='/images/Uber_logo.png'/>
        </div>
        <form onSubmit={(e)=>{submitHandler(e)}} className='loginForm'>
            <div className='CaptinNameSection'>
                <label>What is your name</label>
                <input onChange={(e)=>{setfName(e.target.value)}} className='name' value={fname} type='text' placeholder='first name'/>
                <input onChange={(e)=>{setlName(e.target.value)}} className='name' value={lname} type='text' placeholder='last name'/>
            </div>
            <div className='CaptinEmailSection'>
                <label>What is your email</label>
                <input onChange={(e)=>{setEmail(e.target.value)}} value={email} type='email' placeholder='abc@gmail.com'/>
            </div>
            <div className='CaptinPassSection'>
                <label>Enter password</label>
                <input onChange={(e)=>{setPassword(e.target.value)}} value={password} type='password'/>
             </div>
             <div className='CaptinVehicleInformation'>
                <label>Vehicle Information</label>
                    <input 
                        type="text" 
                        placeholder="Color" 
                        value={vehicleColor} 
                        onChange={(e) => setVehicleColor(e.target.value)} 
                    />
                    <select 
                        value={vehicleType} 
                        onChange={(e) => setVehicleType(e.target.value)}
                    >
                        <option value="" disabled>Type</option>
                        <option value="Car">Car</option>
                        <option value="MotorCycle">MotorCycle</option>
                        <option value="Auto">Auto</option>
                    </select>

                    <input 
                        type="text" 
                        placeholder="Capacity" 
                        value={vehicleCapacity} 
                        onChange={(e) => setVehicleCapacity(e.target.value)} 
                    />

                    <input 
                        type="text" 
                        placeholder="Plate Number" 
                        value={vehiclePlate} 
                        onChange={(e) => setVehiclePlate(e.target.value)} 
                    /> 
            </div>
            <button type='submit' className='CaptinLoginButton'>
                  Create Account
            </button>
            <p>Already have an account? <Link to={'/captinLogin'}>Login Here</Link></p>
        </form>
        
    </div>
  )
}

export default captinSignup