import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import {logout} from "../../redux/slice/adminSlice"


export default function AdminUsers() {

  const token = useSelector(state => state.admin.token);

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [preview, setPreview] = useState(null);

  const dispatch = useDispatch();
const navigate = useNavigate();

const handleLogout = () => {
  const confirmLogout = window.confirm("Are you sure you want to logout?");

  if (!confirmLogout) return;

  dispatch(logout());
  navigate("/admin/login");
};

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePic: null
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePic: ""
  });

  const API = "http://localhost:5000/admin/users";

  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };


  const validateUsername = (value) => {
    if (!value || value.trim() === "") {
      return "Username is required";
    }
    if (value.startsWith(" ") || value.endsWith(" ")) {
      return "Username cannot start or end with spaces";
    }
    if (/[^a-zA-Z\s]/.test(value)) {
      return "Username can only contain alphabets and spaces";
    }
    return "";
  };

  const validateEmail = (value) => {
    if (!value || value.trim() === "") {
      return "Email is required";
    }
    if (value.includes(" ")) {
      return "Email cannot contain spaces";
    }
    if (/[A-Z]/.test(value)) {
      return "Email cannot contain capital letters";
    }
    const emailRegex = /^[a-z][a-z0-9]*@gmail\.com$/;
    if (!emailRegex.test(value)) {
      return "Email must follow format: abc12@gmail.com (start with letter, numbers optional, only @gmail.com allowed)";
    }
    return "";
  };

  const validatePassword = (value) => {
    if (!value || value.trim() === "") {
      return "Password is required";
    }
    if (value.includes(" ")) {
      return "Password cannot contain spaces";
    }
    if (value.length < 4) {
      return "Password must be at least 4 characters";
    }
    return "";
  };

  const validateConfirmPassword = (value, password) => {
    if (!value || value.trim() === "") {
      return "Confirm Password is required";
    }
    if (value !== password) {
      return "Passwords do not match";
    }
    return "";
  };

  const validateProfilePic = (file) => {
    if (!file) {
      return "Profile picture is required";
    }
    const allowedFormats = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedFormats.includes(file.type)) {
      return "Only JPG, JPEG, PNG formats are allowed";
    }
    return "";
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, username: value });
    
    if (errors.username) {
      const error = validateUsername(value);
      setErrors({ ...errors, username: error });
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, email: value });
    
    if (errors.email) {
      const error = validateEmail(value);
      setErrors({ ...errors, email: error });
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, password: value });
    
    if (errors.password) {
      const error = validatePassword(value);
      setErrors({ ...errors, password: error });
    }
    
    if (errors.confirmPassword && form.confirmPassword) {
      const confirmError = validateConfirmPassword(form.confirmPassword, value);
      setErrors({ ...errors, password: error, confirmPassword: confirmError });
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, confirmPassword: value });
    
    if (errors.confirmPassword) {
      const error = validateConfirmPassword(value, form.password);
      setErrors({ ...errors, confirmPassword: error });
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, profilePic: file });

    if (file) {
      setPreview(URL.createObjectURL(file));
    }

    const error = validateProfilePic(file);
    setErrors({ ...errors, profilePic: error });
  };

  const validateAllFields = () => {
    const newErrors = {
      username: validateUsername(form.username),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirmPassword: validateConfirmPassword(form.confirmPassword, form.password),
      profilePic: validateProfilePic(form.profilePic)
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some(error => error !== "");
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API, authHeader);
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm("Are you sure you want to delete this user?");

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/${id}`, authHeader);
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const openEdit = (user) => {
    setSelectedUser(user);
    setForm({
      username: user.username,
      email: user.email,
      password: "",
      confirmPassword: "",
      profilePic: null
    });
    setErrors({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      profilePic: ""
    });
    setShowEdit(true);
  };

  const handleUpdate = async () => {

    const usernameError = validateUsername(form.username);
    const emailError = validateEmail(form.email);

    if (usernameError || emailError) {
      setErrors({
        ...errors,
        username: usernameError,
        email: emailError
      });
      return;
    }

    const confirmUpdate = window.confirm("Confirm update?");

    if (!confirmUpdate) return;

    try {
      await axios.put(`${API}/${selectedUser._id}`, form, authHeader);

      setShowEdit(false);
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddUser = async () => {

    if (!validateAllFields()) {
      return;
    }

    const confirmAdd = window.confirm("Confirm add user?");

    if (!confirmAdd) return;

    try {

      const data = new FormData();

      data.append("username", form.username);
      data.append("email", form.email);
      data.append("password", form.password);
      data.append("profilePic", form.profilePic);

        await axios.post(API, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        });

        setShowAdd(false);
        setPreview(null);
        setForm({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          profilePic: null
        });
        setErrors({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          profilePic: ""
        });
        fetchUsers();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
        <div className="relative min-h-screen bg-gray-100">

      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <h1 className="text-3xl ml-10 font-bold">Users List</h1>
        <button
  onClick={handleLogout}
  title="Logout"
  className="absolute top-2 text-gray-800 hover:text-gray-500 transition"
>
  <LogOut size={26} />
</button>
        <div className="flex gap-4">
          <input
            placeholder="Search users..."
            className="px-4 py-2 border rounded-lg"
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            onClick={() => setShowAdd(true)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            + Add User
          </button>
          
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full">

          <thead className="bg-gray-200">
            
            <tr>
              <th className="p-3">No</th>
              <th className="p-3">Profile</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredUsers.map((user, index) => (
              <tr key={user._id} className="border-t text-center">
                <td className="p-3">{index + 1}</td>
                <td className="p-3 flex justify-center">
                  <img
                    src={`http://localhost:5000/uploads/${user.profilePic}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </td>

                <td>{user.username}</td>
                <td>{user.email}</td>

                <td className="space-x-2">

                  <button
                    onClick={() => openEdit(user)}
                    className="bg-yellow-400 px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}

          </tbody>
        </table>
      </div>

{/* Edit modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

          <div className="bg-white p-6 rounded-xl w-[90%] md:w-[400px]">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>

            <div className="mb-3">
              {errors.username && (
                <p className="text-red-500 text-sm mb-1">{errors.username}</p>
              )}
              <input
                className={`border w-full p-2 ${errors.username ? "border-red-500" : ""}`}
                value={form.username}
                onChange={handleUsernameChange}
              />
            </div>

            <div className="mb-3">
              {errors.email && (
                <p className="text-red-500 text-sm mb-1">{errors.email}</p>
              )}
              <input
                className={`border w-full p-2 ${errors.email ? "border-red-500" : ""}`}
                value={form.email}
                onChange={handleEmailChange}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowEdit(false)}>Cancel</button>

              <button
                onClick={handleUpdate}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Update
              </button>
            </div>

          </div>
        </div>
      )}

{/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

          <div className="bg-white p-6 rounded-xl w-[90%] md:w-[400px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add User</h2>

            <div className="mb-3">
              {errors.username && (
                <p className="text-red-500 text-sm mb-1">{errors.username}</p>
              )}
              <input
                placeholder="Name"
                className={`border w-full p-2 ${errors.username ? "border-red-500" : ""}`}
                value={form.username}
                onChange={handleUsernameChange}
              />
            </div>

            <div className="mb-3">
              {errors.email && (
                <p className="text-red-500 text-sm mb-1">{errors.email}</p>
              )}
              <input
                placeholder="Email"
                className={`border w-full p-2 ${errors.email ? "border-red-500" : ""}`}
                value={form.email}
                onChange={handleEmailChange}
              />
            </div>

            <div className="mb-3">
              {errors.password && (
                <p className="text-red-500 text-sm mb-1">{errors.password}</p>
              )}
              <input
                type="password"
                placeholder="Password"
                className={`border w-full p-2 ${errors.password ? "border-red-500" : ""}`}
                value={form.password}
                onChange={handlePasswordChange}
              />
            </div>

            <div className="mb-3">
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mb-1">{errors.confirmPassword}</p>
              )}
              <input
                type="password"
                placeholder="Confirm Password"
                className={`border w-full p-2 ${errors.confirmPassword ? "border-red-500" : ""}`}
                value={form.confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
            </div>

            <div className="mb-3">
              {errors.profilePic && (
                <p className="text-red-500 text-sm mb-1">{errors.profilePic}</p>
              )}
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                className={`w-full ${errors.profilePic ? "border border-red-500" : ""}`}
                onChange={handleProfilePicChange}
              />
            </div>

            {preview && (
              <div className="flex justify-center mb-3">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover border"
                />
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button onClick={() => {
                setShowAdd(false);
                setPreview(null);
                setForm({
                  username: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                  profilePic: null
                });
                setErrors({
                  username: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                  profilePic: ""
                });
              }}>
                Cancel
              </button>

              <button
                onClick={handleAddUser}
                className="bg-gray-600 text-white px-3 py-1 rounded"
              >
                Add
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
    </div>
  );
}