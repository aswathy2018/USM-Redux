import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slice/userSlice';

const Home = () => {
    const username = localStorage.getItem("username")
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () =>{
        dispatch(logout())
        navigate("/login")
    };

  return (
    <div className='center-box'>
        <h2>Hello {username}</h2>
        <select onChange={(e)=>{
            if (e.target.value === "profile") navigate("/profile");
            if(e.target.value === "logout") handleLogout()
        }}>

            <option>Select</option>
            <option value="profile">Profile</option>
            <option value="logout">Logout</option>
        </select>
    </div>
  )
}

export default Home