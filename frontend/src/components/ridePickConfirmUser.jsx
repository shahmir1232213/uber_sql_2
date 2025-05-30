import React, { useContext, useEffect, useRef, useState } from 'react'
import './confirmRide.css'
import './captinDetails.css';
import './ridePopUp.css'
import {Link} from 'react-router-dom'
import axios from 'axios'
import { UserSocketContext } from '../context/UserSocketContext';
import gsap from 'gsap';

const RidePopUp = ({ride, SetCloseConfirmPopUpPannel}) => {
    let [image, setImage] = useState(null);

    useEffect(() => {
        if (ride?.VEHICLE_TYPE === 'car') {
            setImage('/images/blackCar.png');
        } else if (ride?.VEHICLE_TYPE === 'auto') {
            setImage('/images/auto2.png');
        } else {
            setImage('/images/moto2.png');
        }
    }, [ride?.VEHICLE_TYPE]);

    async function cancelRide() {
        let message = "cancelled by user";
        let rideID = ride.RIDE_ID;
        await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/cancel`, { rideID, message }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
    }

    return (
        <div className='box'>
            <h1>Your Ride</h1>
            <div className='captin2'>
                <div className='driver'>
                    <img src='/images/dp.jpeg' alt="Driver" />
                    <p className='driv_name'>Captin ID: {ride?.CAPTIN_ID}</p>
                    {/* If you have plate info, add it here */}
                </div>
                <div className='driverCar'>
                    {image ? <img src={image} alt="Vehicle" /> : null}
                </div>
            </div>
            <i
                className='icon ri-arrow-down-wide-line point3'
                onClick={() => SetCloseConfirmPopUpPannel(true)}
            ></i>
            <div className='Detailsxx'>
                <i className="ri-map-pin-line point4"></i>
                <p className='location'>{ride?.PICKUP}</p>
            </div>
            <div className='Detailsxx'>
                <i className="ri-map-pin-2-fill point4"></i>
                <p className='location'>{ride?.DESTINATION}</p>
            </div>
            <div className='Detailsxx'>
                <i className="ri-cash-line point4"></i>
                <p className='location'>{ride?.FARE} PKR</p>
                <p>Cash</p>
            </div>
            <div className='button-container'>
                <button className='RideCancel' onClick={async () => {
                    SetCloseConfirmPopUpPannel(true);
                    await cancelRide();
                }}>Cancel</button>
            </div>
        </div>
    );
}

export default RidePopUp;
