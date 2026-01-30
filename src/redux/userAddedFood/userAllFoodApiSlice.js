import { apiSlice } from "../../app/api/apiSlice";

export const userAllFoodApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserFood: builder.query({
      query: (data) => {
        return {
          url: `/api/getFoodById/${data.userId}?date=${data.date}`,
          method: "GET",
        };
      },
      providesTags: ["UserFood"],
    }),
    addFood: builder.mutation({
      query: (mealData) => ({
        url: "/api/addFood",
        method: "POST",
        body: mealData,
      }),
      invalidatesTags: ["UserFood"],
    }),
    updateFood: builder.mutation({
      query: (mealData) => ({
        url: "/api/updateFood",
        method: "PUT",
        body: mealData,
      }),
      invalidatesTags: ["UserFood"],
    }),
    removeFood: builder.mutation({
      query: (id) => ({
        url: "/api/removeFood",
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: ["UserFood"],
    }),
  }),
});

export const { useGetUserFoodQuery, useAddFoodMutation,useUpdateFoodMutation, useRemoveFoodMutation } = userAllFoodApiSlice;
