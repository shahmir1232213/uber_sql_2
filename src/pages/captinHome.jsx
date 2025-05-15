import React, { useContext, useEffect, useRef, useState } from 'react';
import '../components/captinDetails.css';
import CaptinDetails from '../components/captinDetails';
import RidePopUp from '../components/ridePopUp';
import 'remixicon/fonts/remixicon.css';
import gsap from 'gsap'; // ✅ Import GSAP
import RidePickConfirm from '../components/ridePickConfirm';
import {CaptinContext} from '../context/captinContext'
import {CaptinSocketContext} from '../context/CaptinSocketContext'
import axios from'axios'
import GeoService from '../services/GeoService';
import MapComponent from '../components/Map';
import { useNavigate } from 'react-router-dom';
// import LiveTracking from '../components/LiveTracking';

const CaptinHome = () => {
 const [ridePannel,setRidePannel] = useState(true)
 const [confirmRidePannel,SetconfirmRidePannel] = useState(true)
 const ridePop = useRef(null);
 const confirmRef = useRef(null);
 const {captin} = React.useContext(CaptinContext)
 const [rideWithUser,Set_rideWithUser] = useState(null)
 const captinSocket = useContext(CaptinSocketContext)
 let navigate = useNavigate()
 
 async function logOutFunc(){
    let response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captin/logout`,{},{
      headers:{
        Authorization:`Bearer ${localStorage.getItem('token')}`
      }
    })
    if(response.status == 200 ){
      localStorage.clear('token')
         navigate('/')
      console.log("logout message from frontend")  
    }
  }

 useEffect(() => {
  if (captin && captin._id) {
    console.log("captin._id: ", captin._id);
    captinSocket.emit('join', captin._id);
      
    const updateLocation = () => {
        if(navigator.geolocation){
            console.log("navigation yes")
            navigator.geolocation.getCurrentPosition(position => {
              captinSocket.emit('update-location-captin',{
                    captinId : captin._id,
                    location: {
                      ltd: position.coords.latitude,
                      lng: position.coords.longitude
                  }
              })
            })
        }
    }
    //gives first location
    updateLocation();
    /* updateLocation is called every 10 seconds 
     to continuously update the location.*/
    let locationInterVal = setInterval(updateLocation,10000)
  }
}, [captin, captinSocket]);

useEffect(() => {
  captinSocket.on('new-ride', (data) => {
    console.log("from user: ", data);
    Set_rideWithUser(data);
    setRidePannel(true);
  });
}, [captinSocket]);

async function confirmRide(){
  let response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`,{
    rideId:rideWithUser._id,
    captin:captin._id
  },
  {
    headers:{
      Authorization:`Bearer ${localStorage.getItem('token')}`
    }
  }
  )
}

useEffect(() => {
  console.log('rideWithUser: ',rideWithUser)
  console.log("Updated ridePannel: ", ridePannel);
}, [ridePannel,rideWithUser]);
 useEffect(() => {
  if (ridePannel === false) {
    gsap.to(ridePop.current, {
      opacity: 0, // Fade it out
      display:'none'
    });
  } 
  else{
    gsap.to(ridePop.current, {
      opacity: 1, // Fade it out
      display:'block'
    });
  }
}, [ridePannel]);

useEffect(() => {
  if (confirmRidePannel === true) {
    gsap.to(confirmRef.current, {
      display:'block'
    })
  }
  else{
    gsap.to(confirmRef.current, {
     // opacity:0,
      display:'none'
    })
  } 
}, [confirmRidePannel]);
  const [pickUpCoordinates, setPickUpCoordinates] = useState({ latitude: null, longitude: null });
  const [destinationCoordinates, setDestinationCoordinates] = useState({ latitude: null, longitude: null });
 
  useEffect(() => {
    async function fetchCoordinates() {
      const coordinates = await GeoService.getCoordinates(`${rideWithUser?.pickup}`);
      //console.log('Pickup coordinates: ',coordinates);
      setPickUpCoordinates(coordinates)
    }
    fetchCoordinates();
  },[rideWithUser?.pickup]);

  /* Points Destination Coordinates */
  useEffect(() => {
    async function fetchCoordinates() {
      const coordinates = await GeoService.getCoordinates(`${rideWithUser?.destination}`);
      //console.log('Destination coordinates:', coordinates);
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
        <div onClick={logOutFunc} className='circle'>
          <i class="ri-booklet-line"></i>
        </div>
      </div>
      <CaptinDetails captin={captin} />
      <div ref={ridePop} style={{display:"block"}}>
        <RidePopUp SetconfirmRidePannel={SetconfirmRidePannel} setRidePannel={setRidePannel} rideWithUser={rideWithUser} confirmRide={confirmRide}/>
      </div>
      <div ref={confirmRef} style={{display:'none'}}>
        <RidePickConfirm SetconfirmRidePannel={SetconfirmRidePannel} rideWithUser={rideWithUser}/>
      </div>
    </div>
  );
};

export default CaptinHome;
