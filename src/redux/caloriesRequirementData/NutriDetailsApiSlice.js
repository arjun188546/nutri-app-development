import { apiSlice } from "../../app/api/apiSlice";

export const nutriDetailsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNutritionDetails: builder.query({
      query: () => "/api/detail/getYourCaloriesRequirement",
    }),
  }),
});

export const {
  useGetNutritionDetailsQuery
} = nutriDetailsApiSlice;
