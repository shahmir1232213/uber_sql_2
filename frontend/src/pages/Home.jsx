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
import RideFinished from '../components/RideFinished';
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
      socket.emit('join',user.USER_ID)
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
  const rideFinishedRef = useRef(null)

  const [selectionPannel,SetSelectionPannel] = useState(null)
  const [selectionPannel_2,SetSelectionPannel_2] = useState(false)
  const [lookingPannel,SetlookingPannel] = useState(false)
  const [confirmPopUpPannel,SetconfirmPopUpPannel] = useState(false)
  const [confiirmPannelClose,SetConfirmPannelClose] = useState(false)
  const [CloseConfirmPopUpPannel,SetCloseConfirmPopUpPannel] = useState(null)
  const [ride,setRide] = useState(null)
  const [rideFinished,setRideFinished] = useState(false)  

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
    useEffect(() => {
  if (socket) {
    socket.on('ride-ended', () => {
      SetStartPannel(false);         // Hide StartRide panel
      setRideFinished(true);         // Show RideFinished panel
      console.log("ride ended socket reached");
    });
  }
  // Optional: cleanup to prevent multiple listeners
  return () => {
    if (socket) socket.off('ride-ended');
  };
}, [socket]);

    useEffect(() => {
      if (rideFinished) {
        // Hide the start panel and show the ride finished panel
        gsap.to(startRef.current, {
          display: 'none',
          duration: 0 // Instant change
        });
        
        gsap.to(rideFinishedRef.current, {
          display: 'block',
          duration: 0 // Instant change
        });
      }
    }, [rideFinished]);

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
  
        // Update this part to match the new data structure
        let locations = response.data.map(elem => ({
          latitude: elem.LATITUDE,
          longitude: elem.LONGITUDE,
          // You'll need to add vehicleType to your backend response or handle its absence
          vehicleType: vehicleIcons[elem.VEHICLE_TYPE] // Defaulting to Car for now
        }));
  
        SetCaptinsArr(locations);
      } catch (error) {
        console.error("Error fetching captins:", error);
      }
    }
  
    getCaptins();
  },[]);
  
  useEffect(()=>{
    console.log("CaptinsArr: ",captinsArr)
  },[captinsArr])

  /* points pickup Coordinates */
  useEffect(() => {
    async function fetchCoordinates() {
      const coordinates = await GeoService.getCoordinates(`${pickup}`);
    //  console.log('Pickup coordinates: ',coordinates);
      setPickUpCoordinates(coordinates)
    }
    fetchCoordinates();
  },[pickup]);

  /* Points Destination Coordinates */
  useEffect(() => {
    async function fetchCoordinates() {
      const coordinates = await GeoService.getCoordinates(`${destination}`);
      //console.log('Destination coordinates:', coordinates);
      setDestinationCoordinates(coordinates);
    }
    fetchCoordinates();
  }, [destination]);


/* Location Panel */
useEffect(() => {
  if (pannel) {
    gsap.to(pannelRef.current, {
      height: '57vh',
      onStart: () => {
        pannelRef.current.style.visibility = 'visible';
      }
    });

    gsap.set(pannelClose.current, {
      display: 'block'
    });
  } else {
    gsap.to(pannelRef.current, {
      height: 0,
      onComplete: () => {
        pannelRef.current.style.visibility = 'hidden';
      }
    });

    gsap.set(pannelClose.current, {
      display: 'none'
    });
  }
}, [pannel]);

/*Vehicle Selection pannel*/
useEffect(() => {
  if (vehiclePannel) {
    // Hide "Find a Trip" panel
    gsap.to(pannelRef.current, {
      height: 0,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        gsap.set(pannelRef.current, {
          visibility: 'hidden',
          display: 'none'
        });
      }
    });

    // Show vehicle panel
    gsap.set(vehicleRef.current, {
      visibility: 'visible',
      display: 'block'
    });

    gsap.fromTo(vehicleRef.current,
      { height: 0, opacity: 0 },
      { height: '50vh', opacity: 1, duration: 0.5 }
    );
  } else {
    // Hide vehicle panel and show "Find a Trip" panel
    gsap.to(vehicleRef.current, {
      height: 0,
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        gsap.set(vehicleRef.current, {
          visibility: 'hidden',
          display: 'none'
        });

        // Show "Find a Trip" panel
        gsap.to(pannelRef.current, {
          height: '57vh',
          onStart: () => {
            pannelRef.current.style.visibility = 'visible';
          }
        });

        gsap.set(pannelClose.current, {
          display: 'block'
        });
      }
    });
  }
}, [vehiclePannel]);

/*Looking pannel*/
useEffect(() => {
  if (selectionPannel) {
    // Hide vehicle panel first
    gsap.to(vehicleRef.current, {
      height: 0,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        gsap.set(vehicleRef.current, {
          display: 'none',
          visibility: 'hidden'
        });

        // Then show ConfirmRide panel
        gsap.set(confirmRef.current, {
          display: 'block',
          visibility: 'visible'
        });

        gsap.fromTo(confirmRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.4 }
        );
      }
    });
  } else {
    // Hide ConfirmRide panel and show vehicle panel
    gsap.to(confirmRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        gsap.set(confirmRef.current, {
          display: 'none',
          visibility: 'hidden'
        });

        // Show vehicle panel
        gsap.set(vehicleRef.current, {
          visibility: 'visible',
          display: 'block'
        });

        gsap.fromTo(vehicleRef.current,
          { height: 0, opacity: 0 },
          { height: '50vh', opacity: 1, duration: 0.5 }
        );
      }
    });
  }
}, [selectionPannel]);


/* Confirm Ride Panel Logic */
useEffect(() => {
  if (selectionPannel_2) {
    // Hide Vehicle Selection panel
    gsap.to(vehicleRef.current, {
      height: 0,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        gsap.set(vehicleRef.current, {
          display: 'none',
          visibility: 'hidden',
        });
      },
    });

    // Show Nearby Riders panel
    gsap.set(lookingPannelRef.current, {
      display: 'block',
      visibility: 'visible',
    });

    gsap.fromTo(
      lookingPannelRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 }
    );
  } else {
    // Hide Nearby Riders panel
    gsap.to(lookingPannelRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        gsap.set(lookingPannelRef.current, {
          display: 'none',
          visibility: 'hidden',
        });
      },
    });
  }
}, [selectionPannel_2]);

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
    <i
      ref={pannelClose}
      className='icon ri-arrow-down-wide-line'
      onClick={() => setPannel(false)} // Close LocationSearch when this icon is clicked
      style={{ display: pannel ? 'block' : 'none' }} // Show only when pannel is open
    ></i>
  </div>
  <div className='line'></div>
  <input
    value={pickup}
    onChange={(e) => {
      setPickup(e.target.value);
      setSearch(e.target.value);
    }}
    onClick={() => {
      setPannel(true); // Open LocationSearch when pickup input is clicked
    }}
    placeholder="Add a pickup location"
  />
  <input
    value={destination}
    onChange={(e) => {
      setDestination(e.target.value);
      setSearch(e.target.value);
    }}
    onClick={() => {
      setPannel(true); // Open LocationSearch when destination input is clicked
    }}
    placeholder="Enter your destination"
  />
  <button
    className='findAtrip'
    type='submit'
    onClick={() => {
      if (pickup && destination) {
        setVehiclePannel(true); // Show vehicle panel
        setPannel(false); // Hide LocationSearch
      } else {
        alert("Please enter both pickup and destination locations.");
      }
    }}
  >
    Find A Trip
  </button>
  {pannel && ( // Only render LocationSearch when pannel is true
    <div ref={pannelRef} className='scroll'>
      <LocationSearch
        vhPannel={{
          search,
          setSearch,
          pickup,
          setPickup,
          destination,
          setDestination,
          f1,
          setf1,
          f2,
          setf2,
        }}
      />
    </div>
  )}
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
        
    {startPannel && (
      <div ref={startRef}>
        <StartRide ride={ride} SetCloseConfirmPopUpPannel={SetCloseConfirmPopUpPannel} />
      </div>
    )}
    
    {rideFinished && (
      <div ref={rideFinishedRef}>
        <RideFinished onClose={() => setRideFinished(false)} />
      </div>
    )}
  </div>
 
  );
};

export default Home;