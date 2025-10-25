import { memo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Urls from '../utils/Urls.js';
import AnimatedButton from "../Components/AnimatedButton.jsx"

const Reset_Password = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${Urls.dev}/api/v1/user/reset-password/${token}`,
        { password: data.password }
      );

      if (response.data.success) {
        toast.success(response.data.message || 'Password reset successfully!');
        reset();
        navigate('/login');
      } else {
        toast.error(response.data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Reset Password Error:', error);
      toast.error(
        error.response?.data?.message || 'Server error while resetting password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/80">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-black/60 p-6 rounded-lg shadow-md w-full max-w-sm flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-white text-center">
          Reset Password
        </h2>

        <div className="flex flex-col">
          <label htmlFor="password" className="text-white mb-1">
            New Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter new password"
            {...register('password', { required: 'Password is required' })}
            className="p-2 rounded bg-transparent border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:border-white"
          />
          {errors.password && (
            <span className="text-red-400 text-sm mt-1">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="confirmPassword" className="text-white mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
            })}
            className="p-2 rounded bg-transparent border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:border-white"
          />
          {errors.confirmPassword && (
            <span className="text-red-400 text-sm mt-1">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <AnimatedButton
          type="submit"
          className={`w-full py-2 font-bold text-white border-4 border-white rounded ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </AnimatedButton>
      </form>
    </div>
  );
};

export default memo(Reset_Password);

