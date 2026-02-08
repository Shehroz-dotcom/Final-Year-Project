import React from "react";
import { useForm } from "react-hook-form";
import Urls from "../utils/Urls.js";
import axios from "axios"
const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

 const onSubmit = async (data) => {
  try {
    const res = await axios.post(
      `${Urls.dev}/api/v1/contact/send`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    alert(res.data.message || "Message sent successfully ✅");
  } catch (error) {
    console.error(error);
    console.log(error.message);
    
    alert("Server not responding ❌");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-black/60">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-black/70 backdrop-blur-md border border-green-500/40 rounded-2xl p-6 space-y-4"
      >
        <h2 className="text-2xl font-bold text-green-400 text-center">
          Contact Me
        </h2>

        <input
          {...register("name", { required: "Name is required" })}
          placeholder="Your Name"
          className="w-full px-4 py-2 rounded-md bg-black/60 text-white border border-green-500/30 focus:outline-none"
        />
        {errors.name && (
          <p className="text-red-400 text-sm">{errors.name.message}</p>
        )}

        <input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Invalid email",
            },
          })}
          placeholder="Your Email"
          className="w-full px-4 py-2 rounded-md bg-black/60 text-white border border-green-500/30 focus:outline-none"
        />
        {errors.email && (
          <p className="text-red-400 text-sm">{errors.email.message}</p>
        )}

        <textarea
          {...register("message", { required: "Message is required" })}
          placeholder="Your Message"
          rows="4"
          className="w-full px-4 py-2 rounded-md bg-black/60 text-white border border-green-500/30 focus:outline-none"
        />
        {errors.message && (
          <p className="text-red-400 text-sm">{errors.message.message}</p>
        )}

        <button
          disabled={isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition disabled:opacity-50"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default Contact;
