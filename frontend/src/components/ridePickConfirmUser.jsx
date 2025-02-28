import React, { useEffect, useState } from 'react'
import './confirmRide.css'
import './captinDetails.css';
import './ridePopUp.css'
import {Link} from 'react-router-dom'
import axios from 'axios'

const RidePopUp = ({ride,SetCloseConfirmPopUpPannel}) => {
    let [image,setImage] = useState(null);
    useEffect(()=>{
    if(ride?.vehicleType == 'car'){
        setImage('/images/blackCar.png')
    }
    else if(ride?.vehicleType == 'auto'){
        setImage('/images/auto.png')
    }
    else{
        setImage('/images/moto.png')
    }
    },[ride?.vehicleType])

    
    async function cancelRide(rideId){
        let message = "cancelled by user";
        let rideID = ride._id;
        let response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/cancel`,{rideID,message},
        {
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
        }) 
    }

    return (
    <div className='RidePopup'>
        <h1>Your Rider</h1>
        <div className='captin2'>
            <div className='driver'>
                <img src='/images/dp.jpeg' />
                <p className='driv_name'>Shahmir</p>
                <p className='driv_plate'>{ride?.captin.vehicle.plate}</p>
            </div>
            <div className='driverCar'>
                {image? <img src={image}  /> : null}
            </div>
        </div>  
        <i
            className='icon ri-arrow-down-wide-line point3'
            onClick={() => {
                
            }}
        ></i> 
        <div className='Detailsxx'>
        <i class="ri-map-pin-line point4"></i>
            <p className='location'>{ride?.pickup}</p>
            {/* <p>street 17D</p> */}
        </div>
        <div className='Detailsxx'>
        <i class="ri-map-pin-2-fill point4"></i>
            <p className='location'>{ride?.destination}</p>
            {/* <p>street 17D</p> */}
        </div>
        <div className='Detailsxx'>
        <i class="ri-cash-line point4"></i>
            <p className='location'>{ride?.fare} PKR</p>
            <p>Cash</p>
        </div>
        {/* <button className='Ride Confirm'>Confirm</button>
        <button className='Ride Ignore'>Ignore</button> */}
        <div className='button-container'>
            {/* <Link to={'/captin-riding'} className='Ride'>Confirm </Link> */}
            <button className='RideCancel' onClick={async ()=>{
                                                SetCloseConfirmPopUpPannel(true)
                                                await cancelRide()
                                            }}>Cancel</button>
        </div>
    </div>
  )
}

export default RidePopUp
