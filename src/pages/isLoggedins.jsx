import {React,useContext, useEffect} from 'react'
import {UserDataContext} from '../context/userContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const isLoggedin = ({children}) => {
  const {user,setUser} = useContext(UserDataContext)
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
            let response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/home`,{
              headers:{
                Authorization:`Bearer ${token}`
              }
            });
            console.log("response from is Logged in: ",response.data)
            setUser(response.data);
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

export default isLoggedin