import React from 'react'

const ResetPass = () => {
  return (
    <div id="log">
        <div className="uberLogo">
            <img src="/images/Uber_logo.png" alt="Uber Logo" />
        </div>
      <form method="POST" className="loginForm">
            <div className="passSection">
                <label htmlFor="password">Enter password</label>
                <input id="password" name="password" type="password" required />
                <label htmlFor="password">Re-Enter password</label>
                <input id="password" name="password" type="password" required />
            </div>
        <button type="submit" className="loginButton">Reset Password</button>
      </form>
    </div>
  )
}

export default ResetPass