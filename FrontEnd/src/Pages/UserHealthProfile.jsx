import { memo, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Urls from '../utils/Urls.js';
import { toast } from 'react-toastify';

const UserHealthProfile = () => {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState(null); // ✅ STORE SAVED PROFILE

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      age: '',
      weight: '',
      dietType: 'omnivore',
      spiceTolerance: 'medium',
      allergies: [],
      goals: [],
      avoid: [],
    },
  });

  const next = () => setStep((s) => Math.min(s + 1, 7));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  // =========================
  // SUBMIT PROFILE
  // =========================
  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${Urls.dev}/api/v1/user/healthProfile`,
        data,
        { withCredentials: true }
      );

      setProfile(data); // ✅ SAVE FOR UI DISPLAY

      toast.success(res.data?.message || 'Profile saved successfully!');
      setStep(7);
    } catch (error) {
      console.error(
        'SAVE PROFILE ERROR:',
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || 'Failed to save profile');
    }
  };

  // =========================
  // DOWNLOAD PDF
  // =========================
  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `${Urls.dev}/api/v1/user/downloadPersonalProfile`,
        {
          responseType: 'blob',
          withCredentials: true,
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');

      link.href = url;
      link.setAttribute('download', 'PersonalProfile.pdf');

      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('Downloaded successfully!');
    } catch (error) {
      console.error('DOWNLOAD ERROR:', error);
      toast.error('Failed to download PDF');
    }

    reset();
    setStep(0);
    setProfile(null);
  };

  // =========================
  // STYLES
  // =========================
  const container =
    'min-h-screen bg-black text-white flex items-center justify-center p-4';

  const card =
    'w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-xl p-6';

  const button =
    'px-4 py-2 rounded border border-zinc-700 active:scale-95 transition';

  const labelBox =
    'flex items-center gap-2 px-3 py-2 rounded border border-zinc-700 cursor-pointer text-white select-none';

  const title = 'text-2xl font-bold text-center mb-4';

  return (
    <div className={container}>
      <div className={card}>
        <h2 className={title}>Personal Profile</h2>

        {/* PROGRESS */}
        <div className="w-full bg-zinc-800 h-2 rounded mb-6">
          <div
            className="h-2 bg-white rounded transition-all"
            style={{ width: `${((step + 1) / 8) * 100}%` }}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* STEP 1 */}
          {step === 0 && (
            <div className="space-y-4">
              <input
                type="number"
                placeholder="Age"
                {...register('age', { required: true })}
                className="w-full p-3 bg-black border border-zinc-700 rounded text-white"
              />
              <input
                type="number"
                placeholder="Weight (kg)"
                {...register('weight', { required: true })}
                className="w-full p-3 bg-black border border-zinc-700 rounded text-white"
              />
            </div>
          )}

          {/* STEP 2 */}
          {step === 1 && (
            <div className="space-y-2">
              <label className="text-sm text-white font-bold">Diet Type</label>

              <select
                {...register('dietType')}
                className="w-full p-3 bg-black border border-zinc-700 rounded text-white"
              >
                <option value="omnivore">Omnivore</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="keto">Keto</option>
                <option value="paleo">Paleo</option>
                <option value="jain">Jain</option>
              </select>
            </div>
          )}

          {/* STEP 3 */}
          {step === 2 && (
            <div className="space-y-2">
              <label className="text-white font-bold">Spice Tolerance</label>

              <select
                {...register('spiceTolerance')}
                className="w-full p-3 bg-black border border-zinc-700 rounded text-white"
              >
                <option value="none">None</option>
                <option value="mild">Mild</option>
                <option value="medium">Medium</option>
                <option value="hot">Hot</option>
              </select>
            </div>
          )}

          {/* STEP 4 - ALLERGIES */}
          {step === 3 && (
            <div className="space-y-3">
              <label className="text-white font-bold">Allergies</label>

              <div className="flex flex-wrap gap-3">
                {['nuts', 'dairy', 'gluten', 'eggs', 'soy', 'seafood'].map(
                  (item) => (
                    <label key={item} className={labelBox}>
                      <input
                        type="checkbox"
                        value={item}
                        {...register('allergies')}
                      />
                      <span className="capitalize">{item}</span>
                    </label>
                  )
                )}
              </div>
            </div>
          )}

          {/* STEP 5 - GOALS */}
          {step === 4 && (
            <div className="space-y-3">
              <label className="text-white font-bold">Goals</label>

              <div className="flex flex-wrap gap-3">
                {[
                  'weight_loss',
                  'muscle_gain',
                  'maintenance',
                  'high_protein',
                  'low_carb',
                ].map((item) => (
                  <label key={item} className={labelBox}>
                    <input
                      type="checkbox"
                      value={item}
                      {...register('goals')}
                    />
                    <span className="capitalize">{item.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6 - AVOID */}
          {step === 5 && (
            <div className="space-y-3">
              <label className="text-white font-bold">Avoid</label>

              <div className="flex flex-wrap gap-3">
                {[
                  'deep_fried',
                  'high_sugar',
                  'high_salt',
                  'processed_food',
                  'trans_fat',
                ].map((item) => (
                  <label key={item} className={labelBox}>
                    <input
                      type="checkbox"
                      value={item}
                      {...register('avoid')}
                    />
                    <span className="capitalize">{item.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7 */}
          {step === 6 && (
            <div className="text-center">
              <p>Review your data and submit</p>
            </div>
          )}

          {/* STEP 8 - PROFILE DISPLAY */}
          {step === 7 && (
            <div className="space-y-4 text-white">
              <h3 className="text-lg font-bold text-center">
                Profile Saved ✅
              </h3>

              {/* PROFILE SUMMARY */}
              {profile && (
                <div className="border border-zinc-700 p-4 rounded space-y-2">
                  <p>
                    <b>Age:</b> {profile.age}
                  </p>
                  <p>
                    <b>Weight:</b> {profile.weight}
                  </p>
                  <p>
                    <b>Diet Type:</b> {profile.dietType}
                  </p>
                  <p>
                    <b>Spice Tolerance:</b> {profile.spiceTolerance}
                  </p>

                  <p>
                    <b>Allergies:</b>{' '}
                    {profile.allergies?.length
                      ? profile.allergies.join(', ')
                      : '-'}
                  </p>

                  <p>
                    <b>Goals:</b>{' '}
                    {profile.goals?.length ? profile.goals.join(', ') : '-'}
                  </p>

                  <p>
                    <b>Avoid:</b>{' '}
                    {profile.avoid?.length ? profile.avoid.join(', ') : '-'}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-500 text-black rounded w-full"
              >
                Download PDF
              </button>
            </div>
          )}

          {/* BUTTONS */}
          {step < 7 && (
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={back}
                className={button}
                disabled={step === 0}
              >
                Back
              </button>

              {step < 6 ? (
                <button
                  type="button"
                  onClick={next}
                  className="px-4 py-2 bg-white text-black rounded"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-black rounded"
                >
                  Submit
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default memo(UserHealthProfile);
