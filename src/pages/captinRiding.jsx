import React, { useState, useEffect } from 'react';
import CompletRide from '../components/completeRide'
import { useLocation } from 'react-router-dom';
import GeoService from '../services/GeoService';
import MapComponent from '../components/Map';

const captinRiding = () => {
  let location = useLocation()
  const rideWithUser = location.state?.rideWithUser;
  React.useEffect(()=>{
    console.log("location: ",rideWithUser);
  },[rideWithUser])
  const [pickUpCoordinates, setPickUpCoordinates] = useState({ latitude: null, longitude: null });
  const [destinationCoordinates, setDestinationCoordinates] = useState({ latitude: null, longitude: null });
 
  useEffect(() => {
    async function fetchCoordinates() {
      const coordinates = await GeoService.getCoordinates(`${rideWithUser?.pickup}`);
     // console.log('Pickup coordinates: ',coordinates);
      setPickUpCoordinates(coordinates)
    }
    fetchCoordinates();
  },[rideWithUser?.pickup]);

  /* Points Destination Coordinates */
  useEffect(() => {
    async function fetchCoordinates() {
      const coordinates = await GeoService.getCoordinates(`${rideWithUser?.destination}`);
     // console.log('Destination coordinates:', coordinates);
      setDestinationCoordinates(coordinates);
    }
    fetchCoordinates();
  }, [rideWithUser?.destination]);
  return (
    <div className='homeMain'>
      <div className="mapContainer">
        <MapComponent pickUpCoordinates={pickUpCoordinates} destinationCoordinates={destinationCoordinates} />
      </div>
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