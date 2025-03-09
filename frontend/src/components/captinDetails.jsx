import React, { useEffect,useContext } from 'react'
import {CaptinContext} from '../context/CaptinContext'

const captinDetails = () => {
  //  useEffect(()=>{
  //    console.log("captin: ",captin)
  //  })
  let {captin} = useContext(CaptinContext);
     useEffect(()=>{
     console.log("captin: ",captin)
   })
  return (
    <div className='capUI'>
      <i class="ri-arrow-down-wide-line"></i>
          <div className='captin'>
              <div className='driver'>
                <img src='/images/dp.jpeg' />
                <p className='driv_name'>{captin.fullName.firstName }</p>
              </div>
              <p>600 $<br></br>Earned</p>
          </div> 
          <div className='captinDetails'>
              <div className='Hrs'>
                <i class="ri-time-fill "></i>
                <p>Online Hrs</p>
                <p>6</p>
              </div>
              <div className='Hrs'>
                <i class="ri-time-fill "></i>
                <p>Online Hrs</p>
                <p>6</p>
              </div>
              <div className='Hrs'>
              <i class="ri-star-half-fill"></i>
                <p>Rating</p>
                <p>6</p>
              </div>
              
          </div> 
      </div>
  )
}

export default captinDetails