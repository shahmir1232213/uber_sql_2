import React, { useEffect } from 'react'
import { createContext } from 'react'
import { io } from 'socket.io-client'
export const UserSocketContext = createContext()

const socket = io(`${import.meta.env.VITE_BASE_URL}/user`)

const SocketContextProvider = ({children}) => {
  
  useEffect(()=>{
    socket.on('connect',()=>{
        console.log("user connected to server")
    })
    socket.on('disconnect',()=>{
        console.log("user disconnected from server")
    })
  },[])

  return (
   <UserSocketContext.Provider value={socket}>
        {children}
   </UserSocketContext.Provider>
  )
}
export default SocketContextProvider