import React from 'react'
import './Start.css'
import{Link} from 'react-router-dom'
const Start = () => {
  return (
    <div>
        <div className='mainHome'>
        <img src="/images/Uber_logo.png" />
            <div className='footerText'>
                <h2>Get Started with Uber</h2>
                <Link to='/userLogin' className="button">Continue</Link>
            </div>
        </div>
    </div>

  )
}

export default Start