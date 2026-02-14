import React, { memo, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { FiMapPin } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Input from "../components/input.jsx";
import UserLocationMap from "../components/UserLocation.jsx";
import { CloudContext } from "../Context/CloudKitchenContext.jsx";
import { getUserLocation } from "../Utils/getUserLocation.js";
import { reverseGeocode } from "../Utils/reverseGeocoder.js";

const Register = () => {
  const navigate = useNavigate();
  const [coords, setCoords] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const { Register: registerCloudKitchen } = useContext(CloudContext);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  const handleOpenMap = async () => {
    setShowMap(true);

    if (!coords) {
      try {
        const pos = await getUserLocation();
        setCoords([pos.latitude, pos.longitude]);
      } catch (err) {
        setLocationError(err.message);
      }
    }
  };

  const onSubmit = async (data) => {
    if (!coords) {
      alert("Please select a location from the map.");
      return;
    }

    try {
      data.latitude = coords[0];
      data.longitude = coords[1];

      const result = await registerCloudKitchen(data);

      if (result.success) {
        navigate("/cloudOrders");
      }
    } catch (err) {
      console.error("Registration failed:", err);
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
          Register
        </h2>

        {/* Branch Code */}
        <Input
          type="tel"
          label="Branch Code"
          name="branchCode"
          register={register}
          errors={errors}
          required="Branch code is required"
          pattern={{
            value: /^[0-9]{3,5}$/,
            message: "Branch code must be 3–5 digits only",
          }}
        />

        {/* Address */}
        <div className="relative">
          <Input
            label="Address"
            name="address"
            register={register}
            errors={errors}
            required="Address is required"
            minLength={{
              value: 5,
              message: "Address must be at least 5 characters",
            }}
          />

          <button
            type="button"
            onClick={handleOpenMap}
            title="Pick location on map"
            className="absolute right-3 top-9.5 text-gray-300 hover:text-green-400 transition"
          >
            <FiMapPin size={20} />
          </button>
        </div>

        {/* Map */}
        {showMap && coords && (
          <div className="mt-4">
            <UserLocationMap
              initialCoords={coords}
              onLocationChange={async (newCoords) => {
                setCoords(newCoords);

                try {
                  const addressString = await reverseGeocode(
                    newCoords[0],
                    newCoords[1],
                  );
                  setValue("address", addressString, {
                    shouldValidate: true,
                  });
                } catch (err) {
                  console.error("Failed to fetch address:", err);
                }
              }}
            />
          </div>
        )}

        {locationError && (
          <p className="text-red-500 mt-2">
            Unable to get location: {locationError}
          </p>
        )}

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
          disabled={!isValid || !coords}
          className={`w-full rounded-md py-2 text-white font-medium transition ${
            !isValid || !coords
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 cursor-pointer"
          }`}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default memo(Register);
