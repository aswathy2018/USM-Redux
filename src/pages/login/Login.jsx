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

const handleLogin = async (e) => {
  e.preventDefault()

  try {
    const res = await axios.post(
      "http://localhost:5000/login",
      { email, password }
    )

    const { token, username } = res.data

    localStorage.setItem("token", token)
    localStorage.setItem("username", username)


    // Update Redux
    dispatch(loginSuccess({ username, token }))


    // Redirect
    navigate("/home")

  } catch (error) {
    alert(error.response?.data?.message || "Login failed")
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-10">
          Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">

          <div>
            <label className="block text-sm font-semibold mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 pr-12 focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-black to-gray-800 text-white font-semibold hover:opacity-90 transition"
          >
            Login
          </button>

        </form>

        <div className="flex items-center my-8">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-4 text-sm text-gray-500">Or</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <p className="text-center text-gray-700">
          Don&apos;t have an account?{' '}
          <button
            onClick={() => navigate('/')}
            className="font-semibold text-black hover:underline"
          >
            Register
          </button>
        </p>

      </div>
    </div>
  )
}

export default Login
