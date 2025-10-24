import { memo, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { UserContext } from '../Context/UserContext/UserContext.jsx';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import AnimatedButton from '../Components/AnimatedButton.jsx';

const Login = () => {
  const { login } = useContext(UserContext);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const { success, message } = await login(data);

      if (success) {
        toast.success(message);
      }
    } catch (error) {
      console.log(error);
      const errMsg =
        error?.response?.data?.message ||
        'Something went wrong, please try again';
      toast.error(errMsg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[rgba(28,28,28,0.4)] backdrop-blur-md rounded-md">
      {/** Transparent charcoal wrapper */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-transparent p-8 rounded-lg shadow-lg w-full max-w-sm border"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Login
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
        <AnimatedButton type="submit" className="w-full py-2 font-bold">
          Log In
        </AnimatedButton>
        <p className="text-white font-bold mt-4 ">
          Dont have an Account{' '}
          <span
            className="hover:text-blue-500 cursor-pointer"
            onClick={() => navigate('/register')}
          >
            Register
          </span>{' '}
          Here !
        </p>
        {/* forget password  page */}
        <p className="text-white font-bold mt-4 ">
          Forget Password{' '}
          <span
            className="hover:text-blue-500 cursor-pointer"
            onClick={() => navigate('/forget_Password')}
          >
            Reset
          </span>{' '}
          Here !
        </p>
      </form>
    </div>
  );
};

export default memo(Login);
