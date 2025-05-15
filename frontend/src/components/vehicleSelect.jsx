import React, { useEffect, useState } from 'react';
import './vehicleSelect.css';
import 'remixicon/fonts/remixicon.css';
import axios from 'axios';

const VehicleSelect = ({ vhPannel, pan, select, vhDetails ,points}) => {
  const [fare,setFare] = useState('')
  const handleVehicleSelect = (vehicleName, vehicleImage,fare,vehicleType) => {
   console.log("vehicleName: ",vehicleName)
    select.SetSelectionPannel(true);
    vhDetails.setvhDetails({
      vehicleName,
      vehicleImage,
      fare,
      vehicleType
    });
  };
  // useEffect(() => {
  //   console.log("points destination: ", points.destination);
  //   console.log("points.pickup: ", points.pickup);
  // });
  
  useEffect(() => {
      const getRide = async () => {
        try {
          let baseUrl = import.meta.env.VITE_BASE_URL;
          let response = await axios.get(`${baseUrl}/rides/get-fare`, {
            params: {
              pickup: points.pickup,
              destination: points.destination,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          console.log("response frontend: ", response.data); // Log the resolved data
          return response.data; // Return the data for further use
        } catch (error) {
          console.error("Error fetching ride data:", error);
          return null; // Return null or handle the error as needed
        }
      };
    
      const fetchAndLogData = async () => {
      try {
          const fareBackend = await getRide();
          console.log("fareBackend: ", fareBackend);
          if (fareBackend) {
            setFare(fareBackend); // Update state only if data is valid
        }
        } catch (error) {
          console.error("Error in fetchAndLogData:", error);
        }
      };

      fetchAndLogData(); // Call the async function
  }, [points.pickup, points.destination]);

  return (
    <div className='vehicleSelect'>
      <i
        className='icon ri-arrow-down-wide-line point2 vehicleCloseArrorw'
        onClick={() => {
          vhPannel.setVehiclePannel(false);
          //pan.setPannel(false);
        }}
      ></i>
      <h1 className='vehicleChose'>Choose Ride</h1>

      {/* Cars */}
      <div
        className='vehicle'
        onClick={() => {
            handleVehicleSelect('Cars', '/images/blackCar.png',fare.car,'car')
          }
        }
          >
        <img src='/images/blackCar.png' alt='Cars' />
        <div className='details'>
          <p className='class'>Uber Go</p>
          <p className='classPara'>Affordable Compact rides</p>
        </div>
        <div className='price'>{fare.car} PKR</div>
      </div>

      {/* Autos */}
      <div
        className='vehicle'
        onClick={() => handleVehicleSelect('Autos', '/images/auto2.png',fare.auto,'auto')}
      >
        <img src='/images/auto2.png' alt='Autos' />
        <div className='details'>
          <p className='class'>Uber Auto</p>
          <p className='classPara'>Affordable Compact rides</p>
        </div>
        <div className='price'>{fare.auto} PKR</div>
      </div>

      {/* Motorcycles */}
      <div
        className='vehicle'
        onClick={() =>
          handleVehicleSelect('Motorcycles', '/images/moto.png',fare.moto,'moto')
        }
      >
        <img src='/images/moto.png' alt='Motorcycles' />
        <div className='details'>
          <p className='class'>Uber Bike</p>
          <p className='classPara'>Affordable Compact rides</p>
        </div>
        <div className='price'>{fare.moto} PKR</div>
      </div>
    </div>
  );
};

export default VehicleSelect;
