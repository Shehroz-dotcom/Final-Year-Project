import NutrientsCard from './NutrientsCard';
import { memo, useMemo, useState } from 'react';
import React from 'react';

const NutrientsContainer = () => {
  const [from, setFrom] = useState('2025-01-01');
  const [to, setTo] = useState('2025-01-31');

  const nutrientsTotals = useMemo(() => {
    try {
      const user = JSON.parse(sessionStorage.getItem('User'));
      if (!user?.nutritionLog?.length) return null;

      const fromDate = new Date(from);
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);

      return user.nutritionLog
        .filter((log) => {
          const logDate = new Date(log.date);
          return logDate >= fromDate && logDate <= toDate;
        })
        .reduce(
          (acc, log) => {
            acc.calories += log.totalCalories ?? 0;
            acc.protein += log.totalProtein ?? 0;
            acc.carbs += log.totalCarbs ?? 0;
            acc.fats += log.totalFats ?? 0;
            return acc;
          },
          { calories: 0, protein: 0, carbs: 0, fats: 0 }
        );
    } catch {
      return null;
    }
  }, [from, to]);

  if (!nutrientsTotals) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4 text-white">NutrientsContainer</h2>
        <p className="text-white">No nutrition data available</p>
      </div>
    );
  }

  // Prepare array for mapping to cards
  const cards = [
    { label: 'Calories', value: nutrientsTotals.calories, unit: ' kcal', color: 'bg-orange-500', icon: '🔥' },
    { label: 'Protein', value: nutrientsTotals.protein, unit: ' g', color: 'bg-red-500', icon: '🥩' },
    { label: 'Carbs', value: nutrientsTotals.carbs, unit: ' g', color: 'bg-yellow-500', icon: '🍞' },
    { label: 'Fats', value: nutrientsTotals.fats, unit: ' g', color: 'bg-green-500', icon: '🥑' },
  ];

  return (
    <div className="p-4">
    

      {/* Styled Date Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex flex-col">
          <label className="text-white font-medium mb-1">From:</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-800 text-white"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-white font-medium mb-1">To:</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-800 text-white"
          />
        </div>
      </div>

      {/* Render separate cards for each nutrient */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <NutrientsCard key={card.label} {...card} />
        ))}
      </div>
    </div>
  );
};

export default memo(NutrientsContainer);
