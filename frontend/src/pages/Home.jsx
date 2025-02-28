import React, { useRef, useState ,useEffect, useContext} from 'react';
import 'remixicon/fonts/remixicon.css';
import gsap from 'gsap';
import './home.css';
import LocationSearch from '../components/LocationSearchBar';
import VehicleSelect from '../components/vehicleSelect';
import ConfirmRide from '../components/confirmRide';
import NearbyRiders from '../components/NearbyRiders'
import MapComponent from '../components/Map';
import {UserDataContext} from '../context/userContext';
import {UserSocketContext} from '../context/UserSocketContext'
import RidePickConfirm from '../components/ridePickConfirmUser';

const Home = () => {
  /* asal main socket hai bus name 
   captin diya va don't confuse*/

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
       display:'none'
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
      <MapComponent />
    </div>

    {/* Uber Logo */}
    <div className='uberLogo'>
      <img src='/images/Uber_logo.png' alt="Uber Logo" />
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
  </div>
 
  );
};

export default Home;
