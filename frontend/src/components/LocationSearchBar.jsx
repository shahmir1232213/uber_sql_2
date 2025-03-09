// import React, { useEffect, useState } from 'react';
// import './LocationSearchBar.css';
// import VehicleSelect from './vehicleSelect';
// import axios from 'axios';
// import GeoService from '../services/GeoService';

// const LocationSearchBar = ({vhPannel}) => {
//   const [suggestions, setSuggestions] = useState([]);
//   async function fetchCoordinates() {
//     const coordinates = await GeoService.getCoordinates('Shahrah-e-Faisal, Karachi');
//     console.log(coordinates);
//   }
  
//   fetchCoordinates();
//   // useEffect(()=>{
//   //   console.log("destination: ",vhPannel.destination)
//   //   console.log("pickup: ",vhPannel.pickup)
//   // },[vhPannel.destination, vhPannel.pickup])
  
//   useEffect(() => {
//     async function fetchSuggestion() {
//       if (!vhPannel || !vhPannel.search) {
//         console.log("vhPannel.search: Empty");
//         return;
//       }
  
//       try {
//         const baseUrl = import.meta.env.VITE_BASE_URL;
//         let token = localStorage.getItem("token");
//         console.log("welcome token:", token);
  
//         const response = await axios.get(
//           `${baseUrl}/maps/get-suggestions?input=${vhPannel.search}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
  
//         console.log("response: ", response.data);
//         setSuggestions(response.data);
//       } catch (error) {
//         console.error("API request failed:", error);
//       }
//     }
  
//     fetchSuggestion();
//   }, [vhPannel.search]); // Runs whenever `vhPannel.pickup` changes
  
    
//       const locations = [
//         { address: "Shahrah-e-Faisal", area: "PECHS" },
//         { address: "I.I. Chundrigar Road", area: "Saddar Town" },
//         { address: "DHA Phase 6", area: "Defence Housing Authority" },
//         { address: "Bahadurabad", area: "Gulshan Town" },
//         { address: "Malir Cantt", area: "Malir" },
//       ];

//   return (
//     <div>
//       {suggestions.map((elem, index) => (
//         <div
//           key={index}
//           className="loc"
//           onClick={() =>{
//             if (vhPannel.f1==false) {
//               vhPannel.setPickup(elem);
//               vhPannel.setf1(true);
//             } else {
//               vhPannel.setDestination(elem);
//               vhPannel.setf2(true);
//             }
//           }}
//         >
//           <i className="ri-map-pin-fill point"></i>
//           <h3>{elem}</h3>
//         </div>
//       ))}
//     </div>
//   );
// };

//  export default LocationSearchBar;
 
import React from 'react';
import './LocationSearchBar.css';

const LocationSearchBar = ({ vhPannel }) => {
  const locations = [
    { address: "Shahrah-e-Faisal", area: "PECHS" },
    { address: "I.I. Chundrigar Road", area: "Saddar Town" },
    { address: "DHA Phase 6", area: "Defence Housing Authority" },
    { address: "Bahadurabad", area: "Gulshan Town" },
    { address: "Malir Cantt", area: "Malir" },
  ];

  return (
    <div>
      {locations.map((location, index) => (
        <div
          key={index}
          className="loc"
          onClick={() => {
            if (!vhPannel.f1) {
              vhPannel.setPickup(location.address);
              vhPannel.setf1(true);
            } else {
              vhPannel.setDestination(location.address);
              vhPannel.setf2(true);
            }
          }}
        >
          <i className="ri-map-pin-fill point"></i>
          <h3>{location.address}, {location.area}</h3>
        </div>
      ))}
    </div>
  );
};

export default LocationSearchBar;
