import { useContext, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { UserContext } from '../Context/UserContext/UserContext.jsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserLocationMap from '../Components/UserLocation.jsx';
import { FiMapPin } from 'react-icons/fi';
import { getUserLocation } from '../utils/getUserLocation.js';
import { reverseGeocode } from '../utils/reverseGeocoder.js';

const Register = () => {
  const [coords, setCoords] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const { Register } = useContext(UserContext);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const handleOpenMap = async () => {
    setShowMap(true);

    if (!coords) {
      try {
        const pos = await getUserLocation();
        setCoords([pos.latitude, pos.longitude]);
      } catch (err) {
        setLocationError(err.message);
        toast.error(err.message);
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
            className={`w-full px-3 py-2 rounded bg-transparent border text-white 
              ${errors.email ? 'border-red-500' : 'border-gray-500/40'}`}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook)\.com$/,
                message: 'Email must be valid',
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
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
            className={`w-full px-3 py-2 rounded bg-transparent border text-white 
              ${errors.fullName ? 'border-red-500' : 'border-gray-500/40'}`}
            {...register('fullName', {
              required: 'Full name is required',
              minLength: {
                value: 3,
                message: 'Full name must be at least 3 characters',
              },
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: 'Full name must contain only letters',
              },
            })}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-white">
            Phone Number
          </label>
          <Controller
            name="phoneNo"
            control={control}
            rules={{
              required: 'Phone number is required',
              pattern: {
                value: /^\d{4}-\d{7}$/,
                message: 'Phone number must be in format 0312-7384562',
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="tel"
                placeholder="0312-7384562"
                maxLength={12}
                className={`w-full px-3 py-2 rounded bg-transparent border text-white 
        ${errors.phoneNo ? 'border-red-500' : 'border-gray-500/40'}`}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '');

                  if (value.length > 4) {
                    value = value.slice(0, 4) + '-' + value.slice(4, 11);
                  }

                  field.onChange(value); // update react-hook-form properly
                }}
              />
            )}
          />

          {errors.phoneNo && (
            <p className="text-red-500 text-sm mt-1">
              {errors.phoneNo.message}
            </p>
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
              className={`w-full px-3 py-2 pr-10 rounded bg-transparent border text-white resize-none 
                ${errors.address ? 'border-red-500' : 'border-gray-500/40'}`}
              {...register('address', {
                required: 'Address is required',
                minLength: {
                  value: 10,
                  message: 'Address must be at least 10 characters',
                },
              })}
            />

            <FiMapPin
              className="absolute right-3 top-3 text-white/70 cursor-pointer hover:text-white"
              size={18}
              onClick={handleOpenMap}
              title="Use current location"
            />
          </div>

          {errors.address && (
            <p className="text-red-500 text-sm mt-1">
              {errors.address.message}
            </p>
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
                setValue('address', addressString, {
                  shouldValidate: true,
                });
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
            className={`w-full px-3 py-2 rounded bg-transparent border text-white 
              ${errors.password ? 'border-red-500' : 'border-gray-500/40'}`}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()[\]{}\-_=+]).{8,}$/,
                message:
                  'Password must include uppercase, lowercase, number, and special character',
              },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!isValid}
          className="w-full py-2 bg-black text-white hover:bg-white hover:text-black font-bold rounded transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
