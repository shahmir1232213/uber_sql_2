import React from 'react';

const RideFinished = ({ onClose }) => (
  <div className='RidePopup'>
    <h1>Ride Finished</h1>
    <div className='captin2_start' style={{ justifyContent: 'center' }}>
      <div className='driver'>
        <img src='/images/dp.jpeg' alt="Driver" />
        <p className='driv_name'>Thank you!</p>
      </div>
    </div>
    <div className='Detailsxx'>
      <i className="ri-star-fill point4" style={{ color: '#FFD700', fontSize: '2rem' }}></i>
      <p className='location'>We hope you enjoyed your ride.</p>
    </div>
    <div className='Detailsxx'>
      <i className="ri-cash-line point4"></i>
      <p className='location'>Payment Complete</p>
    </div>
    <div className='button-container'>
      <button className='RideCancel' onClick={onClose}>Close</button>
    </div>
  </div>
);

export default RideFinished;