import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Start from './pages/Start';
import UserLogin from './pages/userLogin';
import CaptinLogin from './pages/captinLogin';
import UserSignup from './pages/userSignup';
import CaptinSignup from './pages/captinSignup';
import { UserDataContext } from './context/userContext';
import IsLoggedin from './pages/isLoggedins.jsx';
import IsLoggedInCaptin from './pages/isLoggedinCaptin.jsx';
import Home from './pages/home';
import UserLogout from './pages/UserLogout';
import CaptinHome from './pages/captinHome.jsx';
import CaptinRiding from './pages/captinRiding.jsx';
import Map from './components/Map'; // Import the Map component
import UserForgotPass from './pages/UserForgotPass.jsx';
import ResetPass from './pages/ResetPass'

function App() {
  const user = React.useContext(UserDataContext);
  console.log('User: ', user);

  return (
    <div>
      <Routes>
        <Route path='/' element={<Start />} />
        <Route path='/userLogin' element={<UserLogin />} />
        <Route path='/captinLogin' element={<CaptinLogin />} />
        <Route path='/userSignup' element={<UserSignup />} />
        <Route path='/captinSignup' element={<CaptinSignup />} />
        <Route
          path='/home'
          element={
            <IsLoggedin>
              <Home />
            </IsLoggedin>
          }
        />
        <Route path='/user/logout' element={<UserLogout />} />
        <Route path='/captin/logout' element={<UserLogout />} />
        <Route path='/captin-riding' element={
          <IsLoggedInCaptin>
            <CaptinRiding />
          </IsLoggedInCaptin>
        } />
        <Route
          path='/captinHome'
          element={
            <IsLoggedInCaptin>
              <CaptinHome />
            </IsLoggedInCaptin>
          }
        />
        <Route 
          path='/forgot-password'
          element={
            <UserForgotPass />
          }  
        />
        <Route
          path='/resetPass'
          element={
            <ResetPass />
          }
        />
        <Route path='/map' element={<Map />} /> {/* New route for the Map component */}
      </Routes>
    </div>
  );
}

export default App;
