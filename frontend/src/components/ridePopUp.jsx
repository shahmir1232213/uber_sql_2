import React, { useEffect } from 'react'
import './confirmRide.css'
import './captinDetails.css';
import './ridePopUp.css'
const RidePopUp = ({setRidePannel,SetconfirmRidePannel,rideWithUser,confirmRide}) => {
//   useEffect(()=>{
//     console.log("confirmRide: ",rideWithUser)
//   })
    return (
    <div className='RidePopup'>
        <h1>New Ride Available</h1>
        <i
            className='icon ri-arrow-down-wide-line point3'
            onClick={() => {
                setRidePannel(false)
            }}
        ></i> 
        <div className='Detailsxx'>
        <i class="ri-map-pin-line point4"></i>
            <p className='location'>{rideWithUser?.pickup}</p>
            {/* <p>street 17D</p> */}
        </div>
        <div className='Detailsxx'>
        <i class="ri-map-pin-2-fill point4"></i>
            <p className='location'>{rideWithUser?.destination}</p>
            {/* <p>street 17D</p> */}
        </div>
        <div className='Detailsxx'>
        <i class="ri-cash-line point4"></i>
            <p className='location'>{rideWithUser?.fare}$</p>
            <p>Cash</p>
        </div>
        {/* <button className='Ride Confirm'>Confirm</button>
        <button className='Ride Ignore'>Ignore</button> */}
        <div className='button-container'>
            <button className='Ride Confirm' onClick={()=>{
                                                SetconfirmRidePannel(true)
                                                confirmRide()
                                             }}>Agree</button>
            <button className='Ride Ignore' onClick={()=>{setRidePannel(false)}}>Ignore</button>
        </div>
    </div>
  )
}

export default RidePopUp
