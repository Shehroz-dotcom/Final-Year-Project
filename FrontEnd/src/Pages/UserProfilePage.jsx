import { memo } from 'react';
import NutrientsContainer from '../Components/NutrientsContainer.jsx';
const UserProfilePage = () => {
  return (
    <div>
      <h2 className='text-white font-bold'></h2>
      <div className="">
        <NutrientsContainer/>
      </div>
    </div>
  );
};

export default memo(UserProfilePage);