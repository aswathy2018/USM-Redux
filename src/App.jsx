import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from "./pages/login/Login"
import Signup from "./pages/signup/Signup"
import { UserProtect, UserLoginProtect } from './secure/UserProtect'
import Home from "./pages/home/Home"
import Profile from "./pages/profile/Profile"
import EditProfile from "./pages/profile/EditProfile"
import AdminLogin from "./pages/login/AdminLogin"
import AdminHome from './pages/home/AdminHome'
import { AdminProtect } from './secure/adminProtect'
import { useEffect } from "react";
import axios from "axios";
import { loginSuccess } from "./redux/slice/userSlice";
import { useSelector, useDispatch } from "react-redux";

const App = () => {

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {

    const fetchUser = async () => {
      if (!token) return;

      try {
        const res = await axios.get(
          "http://localhost:5000/userDetailes",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        dispatch(loginSuccess({
          username: res.data.username,
          email: res.data.email,
          profilePic: res.data.profilePic,
          token
        }));

      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();

  }, [token]);
  
  return (
    <Routes>
      {/* User side */}
      <Route path='/login' element={
        <UserLoginProtect>
          <Login />
        </UserLoginProtect>
      } />
      <Route path='/' element={
        <UserLoginProtect>
          <Signup/>
        </UserLoginProtect>
      } />
      <Route path='/home' element={
        <UserProtect>
          <Home/>
        </UserProtect>
      } />
      <Route path='/profile' element={
        <UserProtect>
          <Profile />
        </UserProtect>
      } />
      <Route path='/editProfile' element={
        <UserProtect>
          <EditProfile />
        </UserProtect>
      } />


      {/* Admin side */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/users" element={
        <AdminProtect>
          <AdminHome />
        </AdminProtect>
      }
      />
    </Routes>

  )
}

export default App