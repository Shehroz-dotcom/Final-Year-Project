import { memo, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserContext } from '../Context/UserContext/UserContext.jsx';

const UserProfilePage = () => {
  const { userData, setUserData, logout } = useContext(UserContext);
  const [showUpdate, setShowUpdate] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      address: '',
    },
  });

  const watchedFields = watch(['fullName', 'email']);

  // Show update button only if name or email changed
  useEffect(() => {
    if (!userData) return;
    const nameChanged = watchedFields[0] !== userData.fullName;
    const emailChanged = watchedFields[1] !== userData.email;
    setShowUpdate(nameChanged || emailChanged);
  }, [watchedFields, userData]);

  // Populate form when userData changes
  useEffect(() => {
    if (userData) {
      reset({
        fullName: userData.fullName || '',
        email: userData.email || '',
        address: userData.address || '',
      });
    }
  }, [userData, reset]);

  const onSubmit = (data) => {
    const updatedUser = { ...userData, ...data };
    setUserData(updatedUser);
    alert('Profile updated successfully');
  };

  return (
    <div className="flex justify-center items-start min-h-screen p-6 bg-black/30 backdrop-blur-md">
      <div className="w-full max-w-md p-6 rounded-lg bg-white/10 text-white backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-4">User Profile</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block mb-1">Full Name</label>
            <input
              {...register('fullName', { required: 'Full Name is required' })}
              type="text"
              className="w-full px-3 py-2 rounded text-black"
            />
            {errors.fullName && (
              <p className="text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1">Email</label>
            <input
              {...register('email', { required: 'Email is required' })}
              type="email"
              className="w-full px-3 py-2 rounded text-black"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block mb-1">Address</label>
            <input
              {...register('address')}
              type="text"
              className="w-full px-3 py-2 rounded text-black"
            />
          </div>

          {/* Update Button */}
          {showUpdate && (
            <button
              type="submit"
              className="w-full py-2 bg-green-600 hover:bg-green-700 rounded font-bold"
            >
              Update Profile
            </button>
          )}
        </form>

        <button
          onClick={logout}
          className="mt-4 w-full py-2 bg-red-600 hover:bg-red-700 rounded font-bold"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default memo(UserProfilePage);
