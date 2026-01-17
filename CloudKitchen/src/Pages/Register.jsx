import React, { memo, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { FiMapPin } from "react-icons/fi";

import Input from "../components/input.jsx";
import UserLocationMap from "../components/UserLocation.jsx";
import { CloudContext } from "../Context/CloudKitchenContext.jsx";
import { getUserLocation } from "../Utils/getUserLocation.js";
import { reverseGeocode } from "../Utils/reverseGeocoder.js";

const Register = () => {
  const [coords, setCoords] = useState(null); // [lat, lng]
  const [locationError, setLocationError] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const { Register: registerCloudKitchen } = useContext(CloudContext);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // 📍 Handle map open + location fetch
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
    try {
      if (coords) {
        data.latitude = coords[0];
        data.longitude = coords[1];
      }
      await registerCloudKitchen(data);
    } catch (err) {}
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

        <Input
          type="text"
          label="Branch Code"
          name="branchCode"
          register={register}
          errors={errors}
          required
        />

        {/* Address + Location Icon */}
        <div className="relative">
          <Input
            label="Address"
            name="address"
            register={register}
            errors={errors}
            required
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
                console.log("Marker moved to:", newCoords);

                // 🔁 Reverse geocode to get address
                try {
                  const addressString = await reverseGeocode(
                    newCoords[0],
                    newCoords[1]
                  );
                  // Update the form address field
                  setValue("address", addressString);
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
          Register
        </button>
      </form>
    </div>
  );
};

export default memo(Register);
