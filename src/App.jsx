import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from "./pages/login/Login"
import Signup from "./pages/signup/Signup"
import { UserProtect, UserLoginProtect } from './secure/UserProtect'
import Home from "./pages/home/Home"
import Profile from "./pages/profile/Profile"

const App = () => {
  return (
    <Routes>
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
    </Routes>
  )
}

export default App