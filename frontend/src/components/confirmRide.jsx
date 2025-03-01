import React, { useEffect } from 'react'
import './confirmRide.css'
import axios from 'axios'
const ConfirmRide = ({vhDetails,select,select2,points}) => {
  async function createRide(){
    console.log("vehicle type: ",vhDetails.vhDetails.vehicleType)
    console.log("point confirm: ",points.pickup)
    let response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
          pickup: points.pickup,
          destination: points.destination,
          vehicleType: vhDetails.vhDetails.vehicleType,
          fare:vhDetails.vhDetails.fare,
        },
        {
          headers:{
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
    );
    return response.data; 
  }
  useEffect(()=>{
    console.log("vhDetails from confirm: ",vhDetails.vhDetails.vehicleImage)
  })
  return (
    <div className='confirmRide'>
        <h1>Confirm your ride</h1>
      <i
        className='icon ri-arrow-down-wide-line point3'
        onClick={() => {
          select.SetSelectionPannel(false)
       //   vhPannel.setVehiclePannel(false)
          //select.SetConfirmPannelClose(true)
         // pan.setPannel(false)
        }}
      ></i>
      <div className='imageDiv'>
      <img src={vhDetails.vhDetails.vehicleImage} alt="Car" />
      </div>
      {/* <div className='riderName'>{vhDetails.vhDetails.vehicleName}</div> */}
      <div className='carDetails'>
        <p className='numPlate'>Aen-504</p>
        <p className='model'>2011</p>
      </div>
      <div className='Rideprice'>
        <p>Price</p>
        <p>{vhDetails.vhDetails.fare} PKR</p>
      </div>
      <button className='ConfirmRide' 
      onClick={async()=>{
         select2.SetSelectionPannel_2(true)
          let ride = await createRide()
          console.log("ride created: ",ride)
      }}>Confirm Ride
      </button>
    </div>
  )
}

export default ConfirmRide
