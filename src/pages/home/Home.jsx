import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slice/userSlice';

const Home = () => {

    const username = useSelector((state) => state.auth.username);
    const profilePic = useSelector((state) => state.auth.profilePic);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleLogout = () =>{
        dispatch(logout())
        navigate("/login")
    };

  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-br from-gray-100 via-gray-200 to-white-300'>
        
        {/* ✅ Navbar */}
        <nav className='w-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 shadow-md'>
            <h1 className='text-center py-4 text-xl sm:text-2xl font-bold tracking-widest text-gray-800 uppercase'>
                Welcome to Home Page
            </h1>
        </nav>


        {/* ✅ True Center Container */}
        <div className='flex flex-1 items-center justify-center px-2 mb-10'>

            {/* Dark Card */}
            <div className='relative w-full max-w-lg bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl shadow-2xl p-6 sm:p-10'>

                

                {/* Header with Arrow */}
                <div className='flex items-center justify-center gap-3 mb-6 relative'>
                    {profilePic ? (
  <img
    src={`http://localhost:5000/uploads/${profilePic}`}
    alt="profile"
    className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-lg"
  />
) : (
  <div className="w-24 h-24 rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center">
    <span className="text-gray-400 text-sm">No Image</span>
  </div>
)}


                    <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide'>
                        Hello <span className='text-gray-300'>{username}</span>
                    </h2>

                    {/* Arrow */}
                    <button
                        onClick={() => setOpen(!open)}
                        className='text-2xl transition-transform duration-300 hover:scale-125'
                    >
                        <span className={`${open ? "rotate-180" : ""} inline-block transition-transform`}>
                            ▼
                        </span>
                    </button>

                </div>

                {/* Dropdown */}
                {open && (
                    <div className='absolute right-6 top-24 w-44 bg-white text-gray-900 rounded-xl shadow-xl overflow-hidden'>
                        
                        <button
                            onClick={() => navigate("/profile")}
                            className='block w-full text-left px-5 py-3 hover:bg-gray-100 transition-colors font-medium'
                        >
                            Profile
                        </button>

                        <button
                            onClick={handleLogout}
                            className='block w-full text-left px-5 py-3 hover:bg-gray-100 transition-colors font-medium'
                        >
                            Logout
                        </button>

                    </div>
                )}

            </div>
        </div>
    </div>
  )
}

export default Home




