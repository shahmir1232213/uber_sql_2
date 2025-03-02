import React, { useRef, useState ,useEffect, useContext} from 'react';
import 'remixicon/fonts/remixicon.css';
import gsap from 'gsap';
import './home.css';
import LocationSearch from '../components/LocationSearchBar';
import VehicleSelect from '../components/vehicleSelect';
import ConfirmRide from '../components/confirmRide';
import NearbyRiders from '../components/NearbyRiders'
import {UserDataContext} from '../context/userContext';
import {UserSocketContext} from '../context/UserSocketContext'
import RidePickConfirm from '../components/ridePickConfirmUser';
import GeoService from '../services/GeoService';
import MapComponent from '../components/Map';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import StartRide from '../components/StartRide';
const Home = () => {
    /* asal main socket hai bus name 
   captin diya va don't confuse*/
   let navigate = useNavigate()

   async function logOutFunc(){
      let response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/logout`,{},{
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
  const socket = useContext(UserSocketContext)
  const {user} = useContext(UserDataContext);
  useEffect(()=>{
    console.log("user from home_2: ",user)
    try{
      socket.emit('join',user._id)
    }
    catch(err){
      console.log("error ",err.message)
    }
  },[user])
  const [pickup,setPickup] = useState('');
  const [destination,setDestination] = useState('');

  const [f1,setf1] = useState(false)
  const [f2,setf2] = useState(false)  

  const [search,setSearch] = useState('');
  const [pannel,setPannel] = useState(false)
  const pannelRef = useRef(null);
  const pannelClose = useRef(null);
  const [vehiclePannel,setVehiclePannel] = useState(null)
  const vehicleRef = useRef(false);
  const formRef = useRef(false)
  const confirmRef = useRef(false)
  const userPopConfirmRef = useRef(null)
  const [selectionPannel,SetSelectionPannel] = useState(null)
  const [selectionPannel_2,SetSelectionPannel_2] = useState(false)
  const [lookingPannel,SetlookingPannel] = useState(false)
  const [confirmPopUpPannel,SetconfirmPopUpPannel] = useState(false)
  const [confiirmPannelClose,SetConfirmPannelClose] = useState(false)
  const [CloseConfirmPopUpPannel,SetCloseConfirmPopUpPannel] = useState(null)
  const [ride,setRide] = useState(null)

  const [pickUpCoordinates, setPickUpCoordinates] = useState({ latitude: null, longitude: null });
  const [destinationCoordinates, setDestinationCoordinates] = useState({ latitude: null, longitude: null });
  let [captinsArr,SetCaptinsArr] = useState([])

  const lookingPannelRef = useRef(false)
  const [vhDetails,setvhDetails] = useState({
    vehicleName:'',
    vehicleImage:'',
    fare:'',
    vehicleType:''
  })
  
  
  function submitHandler(e){
    e.preventDefault();
    console.log("pickup: ",pickup)
    console.log("destination: ",destination)
    console.log("pannel: ",pannel)
  }

  /*              CHANGES          */
  let startRef = useRef()
  let [startPannel,SetStartPannel] = useState(false)
  let userSocket = useContext(UserSocketContext)/* Ride Started for user */
    useEffect(()=>{
        userSocket.on('ride-started',()=>{
            SetCloseConfirmPopUpPannel(true)
            SetStartPannel(true)
            console.log("ride started socket reached")
          })

    },[userSocket])
    /*Ride Started Popup */
    useEffect(() => {
      if (startPannel) {
        gsap.to(startRef.current, {
          display: 'block',
          duration: 0 // Instant update
        })
      }
    }, [startPannel]);



  useEffect(() => {
    async function getCaptins() {
      try {
        let response = await axios.get(`${import.meta.env.VITE_BASE_URL}/captin/setting`);
        console.log("response.data: ", response.data);
  
        const vehicleIcons = {
          Car: "/images/blackCar2.png",
          Auto: "/images/auto2.png",
          MotorCycle: "/images/moto.png"
        };
  
        let locations = response.data.map(elem => ({
          latitude: elem.location.latitude,
          longitude: elem.location.longitude,
          vehicleType: vehicleIcons[elem.vehicle.vehicleType] || elem.vehicle.vehicleType
        }));
  
        SetCaptinsArr(locations);
      } catch (error) {
        console.error("Error fetching captins:", error);
      }
    }
  
    getCaptins();
  }, []);
  
  useEffect(()=>{
    console.log("CaptinsArr: ",captinsArr)
  },[captinsArr])

  /* points pickup Coordinates */
  useEffect(() => {
    async function fetchCoordinates() {
      const coordinates = await GeoService.getCoordinates(`${pickup}`);
      console.log('Pickup coordinates: ',coordinates);
      setPickUpCoordinates(coordinates)
    }
    fetchCoordinates();
  },[pickup]);

  /* Points Destination Coordinates */
  useEffect(() => {
    async function fetchCoordinates() {
      const coordinates = await GeoService.getCoordinates(`${destination}`);
      console.log('Destination coordinates:', coordinates);
      setDestinationCoordinates(coordinates);
    }
    fetchCoordinates();
  }, [destination]);


/*Location Pannel*/
  useEffect(() => {
    if (pannel == true) {
      gsap.to(pannelRef.current, {
        height: '60vh',
        
        visibility: 'visible',
      });
      gsap.to(pannelClose.current,{
        display:'block',
      })
    } else {
      gsap.to(pannelClose.current,{
        display:'none'
      })
      gsap.to(pannelRef.current, {
        height: '0px',
        duration: 0.5,
        ease: "power2.out",
        visibility:'hidden'
      });
     
    }
  }, [pannel],[pannelClose]);


/*Vehicle Selection pannel*/
  useEffect(()=>{
      if(vehiclePannel){
        gsap.to(vehicleRef.current,{
          display:'block'
        })
        gsap.to(pannelRef.current,{
          height:0,
          //display:'none',
          onComplete:()=>{
            setPannel(false)
            console.log("pannel: ",pannel)
          }
        })
      }
      else{
        gsap.to(vehicleRef.current,{
          display:'none'
        }).then(()=>{
          gsap.to(formRef.current, {
         // height:'auto'
          display:'block'
          
        })})
      }
    },[vehiclePannel])  

   useEffect(()=>{
    if(selectionPannel){
      gsap.to(vehicleRef.current,{
        //opacity:0,
        display:'none'
      }).then(()=>{
      gsap.to(confirmRef.current,{
        display:'block',
         onComplete:()=>{ 
          setVehiclePannel(false)
         }
      })})
    }
    else if(selectionPannel==false) {
      gsap.to(confirmRef.current,{ 
       display:'none',
       opacity:0,
      }).then(()=>{
        gsap.to(vehicleRef.current,{
          //opacity:1,
          display:'block'
        })
      })
    }
  },[selectionPannel])  

/*Looking pannel*/
useEffect(()=>{
  if(selectionPannel_2){
    gsap.to(confirmRef.current,{
     height:'0'
    }).then(()=>{
      gsap.to(lookingPannelRef.current,{
        display:'block',
      })  
    })
  }
  else if(selectionPannel_2==false) {
    gsap.to(lookingPannelRef.current,{
      display:'none',
    })
  }
},[selectionPannel_2])
/*Completed Looking pannel */
  useEffect(() => {
    if (pickup === '') {
      setf1(false);
    }
    if (destination === '') {
      setf2(false);
    }
  }, [pickup, destination]);

/*Ride Pop Up Confirm User Pannel */
useEffect(()=>{
  if(confirmPopUpPannel == true){
    gsap.to(userPopConfirmRef.current,{
      display:'block'
    }).then(()=>{
      gsap.to(lookingPannelRef.current,{
        display:'none',
      })
      SetCloseConfirmPopUpPannel(false)
    })
  }
  else{
    gsap.to(userPopConfirmRef.current,{
      display:'none'
    })
  }
},[confirmPopUpPannel])
/*             */
useEffect(()=>{
  if(CloseConfirmPopUpPannel == true){
    gsap.to(userPopConfirmRef.current,{
      display:'none'
    })
    SetconfirmPopUpPannel(false)
  }
})
/*Ride confirmation from captin*/ 
useEffect(()=>{
  if(socket){
    socket.on('ride-confirmed',(data)=>{
      console.log("frontend got confirmed ride: ",data)
      SetconfirmPopUpPannel(true)
      setRide(data)
    })
  }
},[socket])
// useEffect(()=>{
//   SetconfirmPopUpPannel(true)
//   console.log("SetconfirmPopUpPannel: ",SetconfirmPopUpPannel)
// })
useEffect(() => {
  console.log("SetconfirmPopUpPannel", confirmPopUpPannel);
}, [confirmPopUpPannel]);

  return (
    <div className='homeMain'>
    {/* Map positioned as background */}
    <div className="mapContainer">
      <MapComponent pickUpCoordinates={pickUpCoordinates} destinationCoordinates={destinationCoordinates} captinsAr={captinsArr}/>
    </div>

    {/* Uber Logo */}
    
    <div className='uberLogo'>
        <img src='/images/Uber_logo.png' alt="Uber Logo" />
        <div onClick={logOutFunc} className='circle'>
          <i class="ri-booklet-line"></i>
        </div>
      </div>
 

    {/* Booking Form */}
    <form ref={formRef} className='bookRide' onSubmit={(e) => submitHandler(e)}>
      <div className='find'>
        <h2 className='fidText'>Find a ride</h2>
        <i ref={pannelClose} className='icon ri-arrow-down-wide-line' onClick={() => setPannel(false)} style={{ display: 'none' }}></i>
      </div>
      <div className='line'></div>
      <input value={pickup} onChange={(e) => {
                                setPickup(e.target.value)
                                setSearch(e.target.value)
                              }
      } onClick={() => setPannel(true)} placeholder="Add a pickup location" />
      <input value={destination} onChange={(e) => {
                                    setDestination(e.target.value)
                                    setSearch(e.target.value)
                                  }
      } onClick={() => setPannel(true)} placeholder="Enter your destination" />
      <button className='findAtrip' type='submit' onClick={()=>{setVehiclePannel(true)}}>
        Find A Trip
      </button>
      <div ref={pannelRef} className='scroll'>
        <LocationSearch vhPannel={{ 
          vehiclePannel,setVehiclePannel,
          search,setSearch,
          pickup,setPickup,
          destination,setDestination,
          f1,setf1,
          f2,setf2
        }}/>
      </div>
    </form>

    {/* Vehicle Selection */}
    <div ref={vehicleRef} style={{display: 'none' }}>
      <VehicleSelect
        vhPannel={{ vehiclePannel, setVehiclePannel }}
        pan={{ pannel, setPannel }}
        select={{ selectionPannel, SetSelectionPannel }}
        vhDetails={{ vhDetails, setvhDetails }}
        points = {{pickup,setPickup,destination,setDestination}}
      />
    </div>
    <div ref={confirmRef} style={{display: 'none' }}>
        <ConfirmRide 
          vhDetails={{ vhDetails, setvhDetails }} 
          select2={{ selectionPannel_2, SetSelectionPannel_2 }} 
          select={{ selectionPannel, SetSelectionPannel}} 
          points = {{pickup,destination}}
        />
    </div>
    {/* Nearby Riders */}
    <div ref={lookingPannelRef} style={{ display: 'none' }}>
      <NearbyRiders 
        vhDetails={vhDetails} 
        select2={{ selectionPannel_2, SetSelectionPannel_2 }}
        points = {{pickup,setPickup,destination,setDestination}}
      />
    </div>
    <div ref={userPopConfirmRef} style={{display:'none'}}>
        <RidePickConfirm SetCloseConfirmPopUpPannel={SetCloseConfirmPopUpPannel} ride={ride}/>
    </div>
       <div ref={startRef} style={{display:'none'}}>
          <StartRide ride={ride} SetCloseConfirmPopUpPannel={SetCloseConfirmPopUpPannel} />
        </div>
  </div>
 
  );
};

export default Home;