import React from 'react'
import CompletRide from '../components/completeRide'
import { useLocation } from 'react-router-dom';

const captinRiding = () => {
  let location = useLocation()
  const rideWithUser = location.state?.rideWithUser;
  React.useEffect(()=>{
    console.log("location: ",rideWithUser);
  },[rideWithUser])

  return (
    <div className='homeMain'>
      <div className='uberLogo'>
        <img src='/images/Uber_logo.png' alt="Uber Logo" />
        <div className='circle'>
          <i class="ri-booklet-line"></i>
        </div>
      </div>
      <div>
          <CompletRide rideWithUser={rideWithUser}/>
      </div>
    </div>
  )
}

export default captinRiding