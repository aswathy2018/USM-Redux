import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../../redux/slice/userSlice'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const validateEmail = (value) => {
    if (!value.trim()) {
      return 'Email is required';
    }
    if (!/^[a-zA-Z][a-zA-Z0-9]*@gmail\.com$/.test(value)) {
      return 'Email must start with a letter, and only gmail.com is allowed';
    }
    return '';
  };

  const validatePassword = (value) => {
    if (!value) {
      return 'Password is required';
    }
    if (value.includes(' ')) {
      return 'Password must not contain spaces';
    }
    if (value.length < 4) {
      return 'Password must be at least 4 characters long';
    }
    return '';
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    if (value.trim()) {
      setErrors(prev => ({
        ...prev,
        email: validateEmail(value)
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        email: ''
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value) {
      setErrors(prev => ({
        ...prev,
        password: validatePassword(value)
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        password: ''
      }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault()

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    const newErrors = {
      email: emailError,
      password: passwordError
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/login",
        { email, password }
      )
      const { token, username, profilePic, email: userEmail } = res.data
      localStorage.setItem("token", token)
      localStorage.setItem("username", username)
      localStorage.setItem("profilePic", profilePic);
      dispatch(loginSuccess({
        username,
        profilePic,
        email: userEmail,
        token
      }))
      navigate("/home")
    } catch (error) {
      alert(error.response?.data?.message || "Login failed")
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 overflow-hidden">
      <div className="w-full max-w-sm bg-gradient-to-b from-[#0f172a] to-[#020617] text-white rounded-3xl shadow-2xl p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Login
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            {errors.email && (
              <p className="text-red-500 text-sm mb-1">{errors.email}</p>
            )}
            <label className="block text-sm mb-2 text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              className={`w-full px-4 py-2 rounded-lg bg-[#020617] border focus:outline-none focus:ring-2 transition ${
                errors.email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-700 focus:ring-gray-500'
              }`}
            />
          </div>
          <div>
            {errors.password && (
              <p className="text-red-500 text-sm mb-1">{errors.password}</p>
            )}
            <label className="block text-sm mb-2 text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                className={`w-full px-4 py-2 rounded-lg bg-[#020617] border pr-12 focus:outline-none focus:ring-2 transition ${
                  errors.password
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-700 focus:ring-gray-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition">
            Login
          </button>
        </form>
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-700" />
          <span className="px-4 text-sm text-gray-400">Or</span>
          <div className="flex-1 h-px bg-gray-700" />
        </div>
        <p className="text-center text-gray-400">
          Don&apos;t have an account?{" "}
          <button
            onClick={() => navigate('/')}
            className="font-semibold text-white hover:underline">
            Register
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login