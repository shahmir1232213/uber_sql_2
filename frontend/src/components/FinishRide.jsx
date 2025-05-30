import React from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const completeRidePopUp = ({setShowCompleteRide,rideWithUser}) => {
    let navigate = useNavigate()
    async function finishRideFunc(){
       //console.log("rideWithUser at completeRidePopUp: ", rideWithUser);
        let rideId = rideWithUser.RIDE_ID;
        let response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/end-ride`,{rideId},{
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
        })
        navigate('/captinHome')
    }
    return (
         <div className='RidePopup'>
        <h1>Finish this ride</h1>
        <i
            className='icon ri-arrow-down-wide-line point3'
            onClick={() => {
                setShowCompleteRide(false)
            }}
        ></i> 
        <div className='Detailsxx'>
        <i class="ri-map-pin-line point4"></i>
            <p className='location'>{rideWithUser.pickup}</p>
            {/* <p>street 17D</p> */}
        </div>
        <div className='Detailsxx'>
        <i class="ri-map-pin-2-fill point4"></i>
            <p className='location'>{rideWithUser.destination}</p>
            {/* <p>street 17D</p> */}
        </div>
        <div className='Detailsxx'>
        <i class="ri-cash-line point4"></i>
            <p className='location'>{rideWithUser.fare} PKR</p>
            <p>Cash</p>
        </div>
        {/* <button className='Ride Confirm'>Confirm</button>
        <button className='Ride Ignore'>Ignore</button> */}
        <div className='button-container'>
            {/* <button className='Ride Confirm' onClick={()=>{SetconfirmRidePannel(true)}}>Finish Ride</button> */}
            <button className='Ride Confirm' onClick={finishRideFunc}>Finish Ride</button>
        </div>
    </div>

  )
}

export default completeRidePopUp