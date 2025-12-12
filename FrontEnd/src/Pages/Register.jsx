import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserContext } from '../Context/UserContext/UserContext.jsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
  const { Register } = useContext(UserContext);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const { success, message } = await Register(data);

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
          <textarea
            placeholder="Enter your address"
            className="w-full px-3 py-2 rounded bg-transparent border border-gray-500/40 text-white"
            {...register('address', { required: 'Address is required' })}
          />
          {errors.address && (
            <p className="text-red-400 text-sm">{errors.address.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-white">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full px-3 py-2 rounded bg-transparent border border-gray-500/40 text-white"
            {...register('password', { required: 'Password is required' })}
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
