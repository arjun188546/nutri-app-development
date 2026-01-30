import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./UserSlice";
import NutritionSlice from "./NutritionSlice";
import NutriDetailsSlice from './NutriDetailsSlice';

const store = configureStore({
  reducer: {
    user: UserSlice,
    nutrition: NutritionSlice,
    nutriDetails:NutriDetailsSlice
  },
})

export default store;