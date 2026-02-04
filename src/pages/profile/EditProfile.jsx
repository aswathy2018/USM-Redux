import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { loginSuccess } from "../../redux/slice/userSlice";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";

const EditProfile = () => {

const { username, email, profilePic, token } = useSelector((state)=>state.auth);

const [name, setName] = useState(username);
const [userEmail, setUserEmail] = useState(email);
const [password, setPassword] = useState("");
const [image, setImage] = useState(null);
const [imagePreview, setImagePreview] = useState(null);

const dispatch = useDispatch();
const navigate = useNavigate();

const [errors, setErrors] = useState({
  name: '',
  email: '',
  password: '',
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
    return '';
  }
  if (value.includes(' ')) {
    return 'Password must not contain spaces';
  }
  if (value.length < 4) {
    return 'Password must be at least 4 characters long';
  }
  return '';
};

const validateProfilePic = () => {
  if (!image && !profilePic) {
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
  setUserEmail(value);
  
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
    setImage(null);
    setImagePreview(null);
    e.target.value = null;
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    setErrors(prev => ({
      ...prev,
      profilePic: 'Image must be less than 2MB'
    }));
    setImage(null);
    setImagePreview(null);
    e.target.value = null;
    return;
  }

  setImage(file);
  setImagePreview(URL.createObjectURL(file));
};

const handleUpdate = async () => {

  const nameError = validateName(name);
  const emailError = validateEmail(userEmail);
  const passwordError = validatePassword(password);
  const profilePicError = validateProfilePic();

  const newErrors = {
    name: nameError,
    email: emailError,
    password: passwordError,
    profilePic: profilePicError
  };
  setErrors(newErrors);
  if (Object.values(newErrors).some(error => error !== '')) {
    return;
  }

  const isConfirmed = window.confirm(
    "Are you sure you want to update your profile?"
  );

  if (!isConfirmed) {
    return;
  }
  const formData = new FormData();

  formData.append("username", name);
  formData.append("email", userEmail);

  if(password){
    formData.append("password", password);
  }
  if(image){
    formData.append("profilePic", image);
  }
  try {
    const res = await axios.put(
      "http://localhost:5000/update-user",
      formData,
      {
        headers:{
          Authorization:`Bearer ${token}`,
          "Content-Type":"multipart/form-data"
        }
      }
    );
    dispatch(loginSuccess({
      username: res.data.username,
      email: res.data.email,
      profilePic: res.data.profilePic,
      token
    }));
    navigate("/profile");
  } catch(err){
    console.log(err);
  }
};

return (
  <div className="min-h-screen flex justify-center items-center bg-gray-200">
    <button
      onClick={() => navigate("/profile")}
      className="absolute top-4 right-4 bg-white p-2 rounded-full text-gray-700 hover:scale-110 transition shadow-md">
      <FaUser size={18} />
    </button>

    <div className="bg-gray-900 text-white p-8 rounded-2xl w-96">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Edit Profile
      </h2>

      <div className="flex flex-col items-center mb-4">
        <img
          src={imagePreview || `http://localhost:5000/uploads/${profilePic}`}
          className="w-28 h-28 rounded-full object-cover mb-3"/>
        {errors.profilePic && (
          <p className="text-red-500 text-sm mb-2">{errors.profilePic}</p>
        )}
        <input type="file"
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleImageChange}
          className="mb-4"/>
      </div>

      <div className="mb-3">
        {errors.name && (
          <p className="text-red-500 text-sm mb-1">{errors.name}</p>
        )}
        <input value={name}
          onChange={handleNameChange}
          placeholder="Name"
          className={`w-full p-2 rounded text-black border transition ${
            errors.name
              ? 'border-red-500 focus:border-red-400'
              : 'border-gray-300'
          }`}/>
      </div>

      <div className="mb-3">
        {errors.email && (
          <p className="text-red-500 text-sm mb-1">{errors.email}</p>
        )}
        <input value={userEmail}
          onChange={handleEmailChange}
          placeholder="Email"
          className={`w-full p-2 rounded text-black border transition ${
            errors.email
              ? 'border-red-500 focus:border-red-400'
              : 'border-gray-300'
          }`}/>
      </div>

      <div className="mb-6">
        {errors.password && (
          <p className="text-red-500 text-sm mb-1">{errors.password}</p>
        )}
        <input type="password"
          placeholder="New Password (optional)"
          value={password}
          onChange={handlePasswordChange}
          className={`w-full p-2 rounded text-black border transition ${
            errors.password
              ? 'border-red-500 focus:border-red-400'
              : 'border-gray-300'
          }`} />
      </div>

      <button
        onClick={handleUpdate}
        className="w-full bg-white text-black p-2 rounded font-bold hover:bg-gray-200 transition">
        Update Profile
      </button>
    </div>
  </div>
)                          
};

export default EditProfile;