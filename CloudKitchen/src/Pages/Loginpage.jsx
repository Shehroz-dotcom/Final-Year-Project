import { memo } from "react";
import { useForm } from "react-hook-form";
import Input from "../components/input.jsx";
import React from "react";

const Loginpage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => console.log("Login data:", data);

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
          label="Branch Code"
          name="branchCode"
          register={register}
          errors={errors}
          required
        />

        <Input
          label="Address"
          name="address"
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
          className="w-full rounded-md bg-green-600 hover:bg-green-700 py-2 text-white font-medium transition"
        >
          Login
        </button>
      </form>

      <div className="w-full mt-8">
    
      </div>
    </div>
  );
};

export default memo(Loginpage);
