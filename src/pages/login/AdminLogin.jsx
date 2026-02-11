import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../../redux/slice/adminSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const adminState = useSelector(state => state.admin.isLoggedIn);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (adminState) {
      navigate('/admin/users', { replace: true });
    }
  }, [adminState, navigate]);

const handleLogin = async (e) => {
  e.preventDefault();
  setError('');

  try {
    const res = await axios.post('http://localhost:5000/admin/login', {
      email,
      password
    });

    // localStorage.removeItem("token");
    localStorage.setItem("adminToken", res.data.accessToken);
    // dispatch(loginSuccess(res.data));

    // remove user session completely
localStorage.removeItem("token");
localStorage.removeItem("username");
localStorage.removeItem("profilePic");
localStorage.removeItem("email");

// dispatch correctly
dispatch(loginSuccess({
  username: res.data.username,
  token: res.data.accessToken
}));


    navigate('/admin/users', { replace: true });


  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || 'Login failed');
  }
};

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-gray-400">Sign in to your admin account</p>
        </div>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition"
            />
          </div>

          <button type="submit"
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 ease-in-out mt-6">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
