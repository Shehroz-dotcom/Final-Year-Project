import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserContext } from '../Context/UserContext/UserContext.jsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const Register = () => {
  const { Register } = useContext(UserContext);
  const { isSuccess, setIsSuccess } = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { success, message } = await Register(data);
    try {
      if (success) {
        toast.success(message);
        setIsSuccess(true);
      }
    } catch (error) {
      if (!success) {
        const errMsg =
          error?.response?.data?.message ||
          'Something went wrong while register';
        toast.error(errMsg);
      }
    }
  };
  useEffect(() => {
    if (isSuccess) {
      navigate('/');
    }
  }, [isSuccess, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[rgba(28,28,28,0.4)] backdrop-blur-md">
      {/** Transparent charcoal wrapper */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-transparent p-8 rounded-lg shadow-lg w-full max-w-sm border"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Register
        </h2>

        {/** Email Input */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-2 text-white"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 rounded bg-transparent border border-gray-500/40 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        {/* fullName Input */}
        <div className="mb-4">
          <label
            htmlFor="fullName"
            className="block text-sm font-medium mb-2 text-white"
          >
            Fullname
          </label>
          <input
            type="text"
            id="fullName"
            placeholder="Enter your full  name"
            className="w-full px-3 py-2 rounded bg-transparent border border-gray-500/40 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            {...register('fullName', { required: 'full Name is required' })}
          />
          {errors.fullName && (
            <p className="text-red-400 text-sm mt-1">
              {errors.fulName.message}
            </p>
          )}
        </div>

        {/** Password Input */}
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium mb-2 text-white"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            className="w-full px-3 py-2 rounded bg-transparent border border-gray-500/40 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/** Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-black text-white hover:bg-white hover:text-black font-bold rounded transition-all duration-200 cursor-pointer"
        >
          Sign up
        </button>
        <p className="text-white font-bold mt-4 ">
          Already have an Account{' '}
          <span
            className="hover:text-blue-500 cursor-pointer"
            onClick={() => navigate('/login')}
          >
            SignIn
          </span>{' '}
          Here !
        </p>
      </form>
    </div>
  );
};

export default Register;
