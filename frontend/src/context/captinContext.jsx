import React, { createContext, useState } from 'react'

export const CaptinContext = createContext();

const CaptinProvider = ({children}) => {
  const[captin,setCaptin] = useState({
        email:'',
        password:'',
        fullname:{
            firstName:'',
            lastName:'',
        },
        vehicle:{
            color:'',
            capacity:'',
            plate:'',
            vehicleType:'',
        }
  })
 
  return (
      <CaptinContext.Provider value={{captin,setCaptin}}>
          {children}
      </CaptinContext.Provider>
  )
}

export default CaptinProvider