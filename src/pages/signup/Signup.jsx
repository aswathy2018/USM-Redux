import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useDispatch } from 'react-redux'
import axios from '../../utils/axiosInstance'
import { loginSuccess } from '../../redux/slice/userSlice'


const Signup = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePic: ''
  });

  const validateName = (value) => {
    if (!value.trim()) {
      return 'Name is required';
    }
    if (!/^[a-zA-Z]+(\s[a-zA-Z]+)*$/.test(value)) {
      return 'Name must contain only alphabets and single spaces (no leading/trailing spaces)';
    }
    return '';
  };

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

  const validateConfirmPassword = (value) => {
    if (!value) {
      return 'Confirm Password is required';
    }
    if (value !== password) {
      return 'Passwords do not match';
    }
    return '';
  };

  const validateProfilePic = () => {
    if (!profilePic) {
      return 'Profile picture is required';
    }
    return '';
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    
    if (value.trim()) {
      setErrors(prev => ({
        ...prev,
        name: validateName(value)
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        name: ''
      }));
    }
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
      if (confirmPassword) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: value === confirmPassword ? '' : 'Passwords do not match'
        }));
      }
    } else {
      setErrors(prev => ({
        ...prev,
        password: ''
      }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    if (value) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: validateConfirmPassword(value)
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        confirmPassword: ''
      }));
    }
  };

  const handleImageChange = (e) => {
  const file = e.target.files[0];
  
  if (file) {
    setErrors(prev => ({
      ...prev,
      profilePic: ''
    }));
  }

  if (!file) {
    setErrors(prev => ({
      ...prev,
      profilePic: 'Profile picture is required'
    }));
    return;
  }

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

  if (!allowedTypes.includes(file.type)) {
    setErrors(prev => ({
      ...prev,
      profilePic: 'Only JPG, JPEG, PNG allowed'
    }));
    setProfilePic(null);
    setPreview(null);
    return;
  }

  setProfilePic(file);
  setPreview(URL.createObjectURL(file));
};

const handleSignup = async (e) => {
  e.preventDefault();

  const nameError = validateName(name);
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  const confirmPasswordError = validateConfirmPassword(confirmPassword);
  const profilePicError = validateProfilePic();

  const newErrors = {
    name: nameError,
    email: emailError,
    password: passwordError,
    confirmPassword: confirmPasswordError,
    profilePic: profilePicError
  };

  setErrors(newErrors);

  if (Object.values(newErrors).some(error => error !== '')) {
    return;
  }

  try {
    const formData = new FormData();

    formData.append("username", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    formData.append("profilePic", profilePic);

    const res = await axios.post("/signup", formData)

    dispatch(loginSuccess({
      token: res.data.token,
      username: res.data.username,
      profilePic: res.data.profilePic,
      email: res.data.email
    }));
    navigate("/home");

  } catch (err) {
    alert(err.response?.data?.message || "Signup failed");
  }
};

return (
  <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4">
    <div className="w-full max-w-md bg-gradient-to-br from-[#0f172a] to-[#020617] text-white rounded-3xl shadow-2xl p-8">
      <h1 className="text-2xl font-bold text-center mb-4">
        Create Account
      </h1>

      <form onSubmit={handleSignup} className="space-y-5">
        <div className="flex flex-col items-center">
          <label className="cursor-pointer">
            <div className="w-20 h-20 rounded-full border-4 border-gray-600 overflow-hidden hover:scale-105 transition">
              {preview ? (
                <img src={preview}
                  alt="preview"
                  className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-gray-400">
                  Upload
                </div>
              )}
            </div>

            <input type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleImageChange}
              className="hidden" />
          </label>
          {errors.profilePic && (
            <p className="text-red-500 text-sm mt-2">{errors.profilePic}</p>
          )}
        </div>

        <div>
          {errors.name && (
            <p className="text-red-500 text-sm mb-1">{errors.name}</p>
          )}
          <label className="text-sm text-gray-300">Name</label>
          <input type="text"
            placeholder="Name"
            value={name}
            onChange={handleNameChange}
            className={`w-full mt-1 px-3 py-1 rounded-lg bg-[#111827] border focus:outline-none transition ${
              errors.name
                ? 'border-red-500 focus:border-red-400'
                : 'border-gray-700 focus:border-gray-400'
            }`}
          />
        </div>

        <div>
          {errors.email && (
            <p className="text-red-500 text-sm mb-1">{errors.email}</p>
          )}
          <label className="text-sm text-gray-300">Email</label>
          <input type="email"
            placeholder="Email address"
            value={email}
            onChange={handleEmailChange}
            className={`w-full mt-1 px-3 py-1 rounded-lg bg-[#111827] border focus:outline-none transition ${
              errors.email
                ? 'border-red-500 focus:border-red-400'
                : 'border-gray-700 focus:border-gray-400'
            }`}
          />
        </div>

        <div>
          {errors.password && (
            <p className="text-red-500 text-sm mb-1">{errors.password}</p>
          )}
          <label className="text-sm text-gray-300">Password</label>

          <div className="relative">
            <input type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              className={`w-full mt-1 px-3 py-1 rounded-lg bg-[#111827] border pr-12 focus:outline-none transition ${
                errors.password
                  ? 'border-red-500 focus:border-red-400'
                  : 'border-gray-700 focus:border-gray-400'
              }`}
            />

            <button type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mb-1">{errors.confirmPassword}</p>
          )}
          <label className="text-sm text-gray-300">
            Confirm Password
          </label>

          <div className="relative">
            <input type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className={`w-full mt-1 px-3 py-1 rounded-lg bg-[#111827] border pr-12 focus:outline-none transition ${
                errors.confirmPassword
                  ? 'border-red-500 focus:border-red-400'
                  : 'border-gray-700 focus:border-gray-400'
              }`}
            />

            <button type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        <button type="submit"
          className="w-full py-2 rounded-xl bg-white text-black font-semibold hover:scale-[1.02] transition"
        >
          Signup
        </button>
      </form>

      <div className="flex items-center my-6">
        <div className="flex-1 h-px bg-gray-700" />
        <span className="px-3 text-gray-400 text-sm">Or</span>
        <div className="flex-1 h-px bg-gray-700" />
      </div>

      <p className="text-center text-gray-400">
        Already have an account?{" "}
        <button onClick={() => navigate('/login')}
          className="text-white font-semibold hover:underline">
          Login here
        </button>
      </p>

    </div>
  </div>
)
}

export default Signup