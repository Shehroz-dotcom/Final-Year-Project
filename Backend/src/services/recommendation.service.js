// services/recommendation.service.js

import mongoose from 'mongoose';

export const getSmartRecommendations = async (user) => {
  const Food = mongoose.model('Food');

  const {
    healthProfile,
    consumedFoodAttributes = [],
  } = user;

  const consumedTags = new Set();
  const consumedSuitability = new Set();
  const consumedDiet = new Set();

  consumedFoodAttributes.forEach((attr) => {
    attr.tags?.forEach((t) => consumedTags.add(t));
    attr.suitability?.forEach((s) => consumedSuitability.add(s));
    attr.diet_compatibility?.forEach((d) => consumedDiet.add(d));
  });

  const foods = await Food.find({
    diet_compatibility: healthProfile.dietType,
  });

  const safeFoods = foods.filter((food) => {
    if (
      healthProfile.allergies?.some((allergy) =>
        food.ingredients?.includes(allergy)
      )
    ) return false;

    if (
      healthProfile.avoid?.some((avoid) =>
        food.tags?.includes(avoid)
      )
    ) return false;

    return true;
  });

  const scored = safeFoods.map((food) => {
    let score = 0;

    if (food.tags?.some((t) => consumedTags.has(t))) score += 3;
    if (food.suitability?.some((s) => consumedSuitability.has(s))) score += 2;
    if (food.diet_compatibility?.some((d) => consumedDiet.has(d))) score += 2;

    if (healthProfile.goals?.includes('high_protein')) {
      score += food.protein_ratio * 0.2;
    }

    if (healthProfile.goals?.includes('weight_loss')) {
      score -= food.calorie_density * 2;
    }

    if (healthProfile.goals?.includes('low_carb')) {
      score -= food.carbs * 0.1;
    }

    if (food.tags?.includes(healthProfile.spiceTolerance)) {
      score += 1;
    }

    return { food, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map((item) => item.food);
};