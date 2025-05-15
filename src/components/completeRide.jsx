import {React,useEffect,useRef,useState} from 'react'
import './completeRding.css'
import gsap from 'gsap'
import CompleteRidePopUp from './FinishRide'
//import { useLocation } from 'react-router-dom';

const completeRide = ({rideWithUser}) => {
    const [showCompleteRide, setShowCompleteRide] = useState(false);
    const completePop = useRef(null)
    const completeRide = useRef(null)
    // let location = useLocation()
    // try{
    //  const rideWithUser = location.state?.rideWithUser|| null;;
    //  useEffect(()=>{
    //   console.log("location: ",rideWithUser);
    //  },[rideWithUser])
   // }catch(err){
        //console.log("error: ",err)
   // }
    useEffect(()=>{
        if(showCompleteRide){
            gsap.to(completeRide.current,{
                opacity:0,
                display:'none'
            })
            gsap.to(completePop.current,{
                display:'block'
            })
        }
        else{
            gsap.to(completePop.current, {
                display: 'none'
            });
            
            gsap.to(completeRide.current, {
                opacity:1,
                display: 'block'
            });
        }
    })
    return (
        <div className='completeRideMin'>
            <div ref={completeRide} className='completeRide'>
                <i class="ri-arrow-up-s-fill poinUp" onClick={()=>{
                    setShowCompleteRide(true)
                }}></i>
                <div className='completeDetails'>
                <div className='distanceAway'>
                        400 km
                </div>
                <button className='completeButton' onClick={()=>{ setShowCompleteRide(true)}}>Complete Ride</button>
                </div>
            </div> 
            <div ref = {completePop} style={{display:'none'}}>
                <CompleteRidePopUp setShowCompleteRide={setShowCompleteRide} rideWithUser={rideWithUser} />
            </div>
         </div>
  )
}
export default completeRide