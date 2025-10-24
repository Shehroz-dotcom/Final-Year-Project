import { createContext, useState } from 'react';
import axios from 'axios';
import Urls from '../../utils/Urls';

export const FoodContext = createContext(null);

const FoodContextProvider = ({ children }) => {
  const [foodData, setFoodData] = useState([]);

  const getFood = async () => {
    try {
      const response = await axios.get(`${Urls.dev}/api/v1/food/listFood`);
      const newData = response.data.data;
      setFoodData(newData);

    } catch (error) {
      console.error('Error fetching food:', error);
    }
  };

  const contextValue = { foodData, getFood };

  return (
    <FoodContext.Provider value={contextValue}>{children}</FoodContext.Provider>
  );
};

export default FoodContextProvider;
