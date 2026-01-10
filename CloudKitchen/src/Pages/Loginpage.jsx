import React, { memo, useContext } from "react";
import { useForm } from "react-hook-form";
import Input from "../components/input.jsx";
import { CloudContext } from "../Context/CloudKitchenContext.jsx";

const Loginpage = () => {
  const { Login } = useContext(CloudContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (credentials) => {
    try {
      console.log(credentials, "login page ");

      await Login(credentials);
    } catch (error) {}
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

        <Input
          type="text"
          label="Branch Code"
          name="branch_code"
          register={register}
          errors={errors}
          required
        />

        <Input
          label="Password"
          name="password"
          type="password"
          register={register}
          errors={errors}
          required
          minLength={{
            value: 6,
            message: "Password must be at least 6 characters",
          }}
        />

        <button
          type="submit"
          className="w-full rounded-md bg-green-600 hover:bg-green-700 py-2 text-white font-medium transition cursor-pointer"
        >
          Login
        </button>
      </form>

      <div className="w-full mt-8"></div>
    </div>
  );
};

export default memo(Loginpage);
