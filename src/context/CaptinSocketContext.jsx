import React, { createContext, useContext,useEffect } from 'react'
export const CaptinSocketContext = createContext();
import { io } from 'socket.io-client'

const captinSocket = io(`${import.meta.env.VITE_BASE_URL}/captin`);

const SocketContext = ({children}) => {
  useEffect(()=>{
      captinSocket.on('connect',()=>{
          console.log("connected to server")
      })
      captinSocket.on('disconnect',()=>{
          console.log("disconnected from server")
      })
    },[])

  return (
    <CaptinSocketContext.Provider value={captinSocket}>
        {children}
    </CaptinSocketContext.Provider>
  )
}

export default SocketContext