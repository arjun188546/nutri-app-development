import { configureStore } from "@reduxjs/toolkit";

import { apiSlice } from "./api/apiSlice";
import authReducer from "../redux/auth/authSlice";
import NutritionSlice from "../redux/NutritionSlice";
import NutriDetailsSlice from "../redux/NutriDetailsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    nutrition: NutritionSlice,
    nutriDetails: NutriDetailsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});
