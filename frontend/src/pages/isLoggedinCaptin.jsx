import {React,useContext, useEffect} from 'react'
import {CaptinContext} from '../context/captinContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const isLoggedinCaptin = ({children}) => {
  const {captin,setCaptin} = useContext(CaptinContext)
  let navigate = useNavigate()
  useEffect(()=>{
    async function tokenGet(){
      const token = localStorage.getItem('token')
      console.log('token: ',token)
      //console.log("user state from logged in :",user)
      if(!token){
        navigate('/userLogin')
      }
      else{
        try{
            let response = await axios.get(`${import.meta.env.VITE_BASE_URL}/captin/home`,{
              headers:{
                Authorization:`Bearer ${token}`
              }
            });
            console.log("response from is Logged in: ",response.data)
            setCaptin(response.data);
        }
        catch(err){
          throw new Error (err.message)
        }
      }
    }
    tokenGet()
  },[])
  
    return (
        <div>{children}</div>
    )
}

export default isLoggedinCaptin