import React, { memo, useContext } from "react";
import { useForm } from "react-hook-form";
import Input from "../components/input.jsx";
import { useNavigate } from "react-router-dom";
import { CloudContext } from "../Context/CloudKitchenContext.jsx";

const Loginpage = () => {
  const navigate = useNavigate();
  const { Login } = useContext(CloudContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange", // live validation
  });

  const onSubmit = async (credentials) => {
    try {
      const response = await Login(credentials);

      if (response.success) {
        navigate("/cloudOrders");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-8 rounded-xl shadow-lg
                   bg-black/50 backdrop-blur-md border border-black/40"
      >
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Login
        </h2>

        {/* Branch Code */}
        <Input
          type="text"
          label="Branch Code"
          name="branch_code"
          register={register}
          errors={errors}
          required="Branch code is required"
          minLength={{
            value: 3,
            message: "Branch code must be at least 3 digits",
          }}
          maxLength={{
            value: 5,
            message: "Branch code cannot exceed 5 digits",
          }}
          pattern={{
            value: /^[0-9]{3,5}$/,
            message: "Branch code must contain only numbers (3–5 digits)",
          }}
        />

        {/* Password */}
        <Input
          label="Password"
          name="password"
          type="password"
          register={register}
          errors={errors}
          required="Password is required"
          minLength={{
            value: 6,
            message: "Password must be at least 6 characters",
          }}
          pattern={{
            value: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
            message: "Password must contain at least one letter and one number",
          }}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isValid}
          className={`w-full rounded-md py-2 text-white font-medium transition ${
            !isValid
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 cursor-pointer"
          }`}
        >
          Login
        </button>
      </form>

      <div className="w-full mt-8"></div>
    </div>
  );
};

export default memo(Loginpage);
