import React, { createContext, useEffect, useState } from 'react'
export const UserDataContext = createContext()

const UserContext = ({children}) => {
 const [user,setUser] = useState({
  email:'',
  fullName:{
      firstName:'',
      lastName:'',
  }
 })
 useEffect(()=>{
  console.log("userContext: ",user)
 })
  return (
    <div>
        <UserDataContext.Provider value={{user,setUser}}>
            {children}
        </UserDataContext.Provider>
    </div>
  )
}
export default UserContext