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

  // Initialize react-hook-form with mode "onChange" for live validation
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
  });

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

  // 📞 Auto-format phone number: insert dash after 4 digits
  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 4) return digits;
    return digits.slice(0, 4) + '-' + digits.slice(4, 11);
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

  // watch all fields to also track if address + coords are valid
  const watchAllFields = watch();

  const isFormValid =
    isValid &&
    coords &&
    watchAllFields.address &&
    watchAllFields.address !== '';

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
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[\w.-]+@(gmail\.com|outlook\.com|hotmail\.com)$/,
                message:
                  'Email must be @gmail.com, @outlook.com, or @hotmail.com',
              },
            })}
          />
          {errors.email && (
            <p className="text-red-400 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Full Name */}
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

        {/* Phone Number */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-white">
            Phone Number
          </label>
         <input
  type="tel"
  placeholder="0346-3743313"
  className="w-full px-3 py-2 rounded bg-transparent border border-gray-500/40 text-white"
  {...register('phoneNo', {
    required: 'Phone number is required',
    pattern: {
      value: /^[0-9]{4}-[0-9]{7}$/,
      message: 'Phone number must be in format 0346-3743313',
    },
    onChange: (e) => {
      const formatted = formatPhoneNumber(e.target.value);
      setValue('phoneNo', formatted, { shouldValidate: true });
    },
  })}
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
                setCoords(newCoords);
                const addressString = await reverseGeocode(
                  newCoords[0],
                  newCoords[1]
                );
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
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@&]).{6,}$/,
                message:
                  'Password must contain uppercase, lowercase, number, and @ or &',
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
          disabled={!isFormValid}
          className={`w-full py-2 font-bold rounded transition-all duration-200 cursor-pointer
            ${isFormValid ? 'bg-black text-white hover:bg-white hover:text-black' : 'bg-gray-500 text-gray-300 cursor-not-allowed'}
          `}
        >
          Register
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
