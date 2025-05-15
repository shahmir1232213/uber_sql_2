import React from 'react'
import './NearBy.css'

const NearbyRiders = ({vhDetails,select2,points}) => {
  return (
    <div className='box'>
        <h1>Looking for nearby {vhDetails.vehicleName}</h1>
      <i
        className='icon ri-arrow-down-wide-line point3 vehicleCloseArrorw '
        onClick={() => {
          select2.SetSelectionPannel_2(false)
          //lookingPannel.SetlookingPannel(false)
          //pan.setPannel(false)
        }}
      ></i>
      <div className='imageDiv'>
        <img src={vhDetails.vehicleImage} alt="Car" />
      </div>
      <div className='locationDetails'>
        <p className='area'>
            {points.pickup}
        </p>
        <p className='areaDetails'>{points.pickup}</p>
      </div>
      <div className='locationDetails'>
        <p className='area'>
            {points.destination}
        </p>
        <p className='areaDetails'> {points.destination}</p>
      </div>
    </div>
  )
}

export default NearbyRiders
