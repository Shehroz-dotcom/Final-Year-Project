import { memo, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import Urls from '../utils/Urls.js';

const Forget_Password = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${Urls.dev}/api/v1/user/forgetPassword`,
        data
      );

      if (response.data.success) {
        toast.success(response.data.message || 'Reset link sent to your email.');
        reset();
      } else {
        toast.error(response.data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Forget Password Error:', error);

      if (error.response?.status === 404) {
        toast.error('User not found.');
      } else {
        toast.error('Server error while sending reset link.');
      }
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
          Forget Password
        </h2>

        <div className="flex flex-col">
          <label htmlFor="email" className="text-white mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your Email"
            {...register('email', { required: 'Email is required' })}
            className="p-2 rounded bg-transparent border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:border-white"
          />
          {errors.email && (
            <span className="text-red-400 text-sm mt-1">
              {errors.email.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`relative inline-block px-8 py-2 font-bold text-white border-4 border-white rounded cursor-pointer overflow-hidden group transition-all duration-300 ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          <span className="absolute inset-0 before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:w-[10%] before:h-[500%] before:bg-white/30 before:-translate-x-1/2 before:-translate-y-1/2 before:-rotate-45 before:transition-all before:duration-500 before:ease-out group-hover:before:w-[200%] group-hover:before:bg-white group-hover:before:rotate-0"></span>

          <span className="relative z-10 transition-colors duration-500 group-hover:text-black">
            {loading ? 'Sending...' : 'Submit'}
          </span>
        </button>
      </form>
    </div>
  );
};

export default memo(Forget_Password);
