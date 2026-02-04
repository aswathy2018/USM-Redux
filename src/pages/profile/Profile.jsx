
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { FaHome } from "react-icons/fa";

const Profile = () => {

  const navigate = useNavigate()

  const username = useSelector((state) => state.auth.username);
  const profilePic = useSelector((state) => state.auth.profilePic);
  const email = useSelector((state) => state.auth.email);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 px-4'>

      <button
  onClick={() => navigate("/home")}
  className='absolute top-4 right-4 bg-white p-2 rounded-full text-gray-700 hover:scale-110 transition'
>
  <FaHome size={18} />
</button>

      <div className='w-full max-w-md bg-gray-900 text-white rounded-2xl shadow-2xl p-6 sm:p-10'>

        <div className="flex justify-center mb-6">
          <img
            src={
              profilePic
                ? `http://localhost:5000/uploads/${profilePic}`
                : "/default-avatar.png"
            }
            alt="profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-700 shadow-lg"
          />
        </div>

        <div className='space-y-4'>
          <div>
            <p className='text-gray-400 text-sm'>Name</p>
            <h2 className='text-lg font-semibold'>{username}</h2>
          </div>

          <div>
            <p className='text-gray-400 text-sm'>Email</p>
            <h2 className='text-lg font-semibold break-words'>
              {email}
            </h2>
          </div>

          <div>
            <p className='text-gray-400 text-sm'>Password</p>

            <div className='bg-gray-800 px-4 py-2 rounded-lg mt-1'>
              <span className='text-lg tracking-widest select-none'>
                ********
              </span>
            </div>
          </div>


        </div>

        <button className='w-full mt-8 bg-white text-gray-900 font-semibold py-3 rounded-xl hover:bg-gray-200 transition' onClick={() => navigate("/editProfile")}>
          Edit Profile
        </button>

      </div>
    </div>
  )
}

export default Profile;
