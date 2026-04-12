import { memo, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Urls from '../utils/Urls.js';
import { toast } from 'react-toastify';

const UserHealthProfile = () => {
  const [step, setStep] = useState(0);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      dietType: 'omnivore',
      spiceTolerance: 'medium',
      allergies: [],
      goals: [],
      avoid: [],
    },
  });

  const next = () => setStep((s) => Math.min(s + 1, 5));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = async (data) => {
    try {
      await axios.post(`${Urls.dev}/api/v1/user/healthProfile`, data, {
        withCredentials: true,
      });

      reset();
      setStep(0);

      toast.success('Profile saved successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save profile');
    }
  };

  const container =
    'min-h-screen bg-black text-white flex items-center justify-center p-3 sm:p-6';

  const card =
    'w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-xl p-4 sm:p-6';

  const button =
    'px-4 py-2 rounded border border-zinc-700 active:scale-95 transition';

  return (
    <div className={container}>
      <div className={card}>
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
          Health Profile
        </h2>

        {/* PROGRESS BAR */}
        <div className="w-full bg-zinc-800 h-2 rounded mb-6">
          <div
            className="h-2 bg-white rounded transition-all"
            style={{ width: `${((step + 1) / 6) * 100}%` }}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* STEP 1 */}
          {step === 0 && (
            <div>
              <h3 className="text-lg mb-4">Choose your diet</h3>
              <select
                {...register('dietType')}
                className="w-full p-3 bg-black border border-zinc-700 rounded"
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

          {/* STEP 2 */}
          {step === 1 && (
            <div>
              <h3 className="text-lg mb-4">Spice tolerance</h3>
              <select
                {...register('spiceTolerance')}
                className="w-full p-3 bg-black border border-zinc-700 rounded"
              >
                <option value="none">None</option>
                <option value="mild">Mild</option>
                <option value="medium">Medium</option>
                <option value="hot">Hot</option>
              </select>
            </div>
          )}

          {/* STEP 3 */}
          {step === 2 && (
            <div>
              <h3 className="text-lg mb-4">Allergies</h3>

              <div className="flex flex-wrap gap-2">
                {['nuts', 'dairy', 'gluten', 'eggs', 'soy', 'seafood'].map(
                  (item) => (
                    <label
                      key={item}
                      className="px-3 py-2 border border-zinc-700 rounded-full cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={item}
                        {...register('allergies')}
                      />
                      <span className="ml-2">{item}</span>
                    </label>
                  )
                )}
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 3 && (
            <div>
              <h3 className="text-lg mb-4">Health goals</h3>

              <div className="flex flex-wrap gap-2">
                {[
                  'weight_loss',
                  'muscle_gain',
                  'maintenance',
                  'high_protein',
                  'low_carb',
                ].map((item) => (
                  <label
                    key={item}
                    className="px-3 py-2 border border-zinc-700 rounded-full cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={item}
                      {...register('goals')}
                    />
                    <span className="ml-2">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {step === 4 && (
            <div>
              <h3 className="text-lg mb-4">Avoid foods</h3>

              <div className="flex flex-wrap gap-2">
                {[
                  'deep_fried',
                  'high_sugar',
                  'high_salt',
                  'processed_food',
                  'trans_fat',
                ].map((item) => (
                  <label
                    key={item}
                    className="px-3 py-2 border border-zinc-700 rounded-full cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={item}
                      {...register('avoid')}
                    />
                    <span className="ml-2">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6 - REVIEW */}
          {step === 5 && (
            <div className="space-y-2 text-sm">
              <h3 className="text-lg mb-4">Review</h3>
              <p>Check your selections and submit.</p>
              <p className="text-zinc-400">You can go back to edit anything.</p>
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={back}
              className={button}
              disabled={step === 0}
            >
              Back
            </button>

            {step < 5 ? (
              <button
                type="button"
                onClick={next}
                className="px-4 py-2 bg-white text-black rounded active:scale-95 transition"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-black rounded active:scale-95 transition"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(UserHealthProfile);
