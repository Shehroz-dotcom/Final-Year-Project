import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AdminContext } from "../../Context/AdminContext.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const { Register } = useContext(AdminContext);
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      const response = await Register(data);

      if (!response) {
        throw new Error("No response from server");
      }

      const { success, message } = response;

      if (success) {
        toast.success(message);
        setIsSuccess(true);
      } else {
        toast.error(message);
      }
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong while registering";

      toast.error(errMsg);
    }
  };

  useEffect(() => {
    if (isSuccess) navigate("/");
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
              ${errors.email ? "border-red-500" : "border-gray-500/40"}`}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[\w.-]+@(gmail\.com|hotmail\.com|outlook\.com)$/,
                message:
                  "Enter a valid email address",
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
              ${errors.fullName ? "border-red-500" : "border-gray-500/40"}`}
            {...register("fullName", {
              required: "Full name is required",
              minLength: {
                value: 3,
                message: "Minimum 3 characters required",
              },
            })}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Secret Key */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-white">
            Secret Key
          </label>
          <input
            type="text"
            placeholder="Enter secret key"
            className={`w-full px-3 py-2 rounded bg-transparent border text-white 
              ${errors.secretKey ? "border-red-500" : "border-gray-500/40"}`}
            {...register("secretKey", {
              required: "Secret key is required",
              minLength: {
                value: 4,
                message: "Secret key must be at least 4 characters",
              },
            })}
          />
          {errors.secretKey && (
            <p className="text-red-500 text-sm mt-1">
              {errors.secretKey.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-white">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className={`w-full px-3 py-2 rounded bg-transparent border text-white 
              ${errors.password ? "border-red-500" : "border-gray-500/40"}`}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Minimum 8 characters required",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className="w-full py-2 bg-black text-white hover:bg-white hover:text-black font-bold rounded transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sign Up
        </button>

        <p className="text-white font-bold mt-4">
          Already have an account?{" "}
          <span
            className="hover:text-blue-500 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Sign In
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
