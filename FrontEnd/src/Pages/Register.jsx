import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserContext } from '../Context/UserContext/UserContext.jsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserLocationMap from '../Components/UserLocation.jsx';
import { FiMapPin } from 'react-icons/fi';
import { getUserLocation } from '../utils/getUserLocation.js';
import { reverseGeocode } from '../utils/reverseGeocoder.js';

const Register = () => {
  const [coords, setCoords] = useState(null); // [lat, lng]
  const [locationError, setLocationError] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const { Register } = useContext(UserContext);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // 📍 Handle map open + location fetch
  const handleOpenMap = async () => {
    setShowMap(true);

    if (!coords) {
      try {
        const pos = await getUserLocation();
        setCoords([pos.latitude, pos.longitude]);
      } catch (err) {
        setLocationError(err.message);
      }
    }
  };

  const onSubmit = async (data) => {
    if (!coords) {
      toast.error('Please select your location on the map');
      return;
    }

    const payload = {
      ...data,
      latitude: coords[0],
      longitude: coords[1],
    };

    console.log('Sending payload to backend:', payload);

    try {
      const { success, message } = await Register(payload);

      if (success) {
        toast.success(message);
        setIsSuccess(true);
      }
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        'Something went wrong while registering';
      toast.error(errMsg);
    }
  };

  useEffect(() => {
    if (isSuccess) navigate('/');
  }, [isSuccess, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[rgba(28,28,28,0.4)] backdrop-blur-md">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-transparent p-8 rounded-lg shadow-lg w-full max-w-sm border"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Register
        </h2>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-white">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 rounded bg-transparent border border-gray-500/40 text-white"
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email && (
            <p className="text-red-400 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Full name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-white">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full px-3 py-2 rounded bg-transparent border border-gray-500/40 text-white"
            {...register('fullName', { required: 'Full name is required' })}
          />
          {errors.fullName && (
            <p className="text-red-400 text-sm">{errors.fullName.message}</p>
          )}
        </div>

        {/* Phone Number (phoneNo) */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-white">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="Enter your phone number"
            className="w-full px-3 py-2 rounded bg-transparent border border-gray-500/40 text-white"
            {...register('phoneNo', { required: 'Phone number is required' })}
          />
          {errors.phoneNo && (
            <p className="text-red-400 text-sm">{errors.phoneNo.message}</p>
          )}
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-white">
            Address
          </label>

          <div className="relative">
            <textarea
              placeholder="Enter your address"
              className="w-full px-3 py-2 pr-10 rounded bg-transparent border border-gray-500/40 text-white resize-none"
              {...register('address', { required: 'Address is required' })}
            />

            <FiMapPin
              className="absolute right-3 top-3 text-white/70 cursor-pointer hover:text-white"
              size={18}
              onClick={handleOpenMap}
              title="Use current location"
            />
          </div>

          {errors.address && (
            <p className="text-red-400 text-sm">{errors.address.message}</p>
          )}
        </div>

        {showMap && coords && (
          <div className="mt-4 relative border border-gray-500/40 rounded overflow-hidden">
            <UserLocationMap
              initialCoords={coords}
              onLocationChange={async (newCoords) => {
                // console.log('Location changed:', {
                //   latitude: newCoords[0],
                //   longitude: newCoords[1],
                // });

                setCoords(newCoords);

                // 🔁 Fetch address from coordinates
                const addressString = await reverseGeocode(
                  newCoords[0],
                  newCoords[1]
                );

                // Update the address input field
                setValue('address', addressString);
              }}
            />
          </div>
        )}

        {/* Password */}
        <div className="mb-4 mt-4">
          <label className="block text-sm font-medium mb-2 text-white">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full px-3 py-2 rounded bg-transparent border border-gray-500/40 text-white"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />
          {errors.password && (
            <p className="text-red-400 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-black text-white hover:bg-white hover:text-black font-bold rounded transition-all duration-200 cursor-pointer"
        >
          Sign up
        </button>

        <p className="text-white font-bold mt-4">
          Already have an Account{' '}
          <span
            className="hover:text-blue-500 cursor-pointer"
            onClick={() => navigate('/login')}
          >
            SignIn
          </span>{' '}
          Here!
        </p>
      </form>
    </div>
  );
};

export default Register;
