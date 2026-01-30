// src/redux/api/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import * as SecureStore from "expo-secure-store";
import { setCredentials, logOut } from "../../redux/auth/authSlice";

// Base query with token injection
const baseQuery = fetchBaseQuery({
  baseUrl: "https://geneus-solutions-backend.onrender.com",
  prepareHeaders: async (headers) => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      console.log("apiSlice: Found accessToken in SecureStore:", token ? "Yes (truncated)" : "No");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
    } catch (err) {
      console.log("Error reading accessToken in apiSlice:", err);
    }
    return headers;
  },
});

// Add refresh token logic
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 403) {
    console.log("Access token expired, trying refresh...");

    try {
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      if (!refreshToken) throw new Error("No refresh token stored");

      // hit refresh endpoint
      const refreshResult = await fetchBaseQuery({
        baseUrl: "https://geneus-solutions-backend.onrender.com",
      })(
        {
          url: "/refresh_token_android",
          // url: "/refresh_token",
          method: "GET",
          // body: { refreshToken },
          headers: {
            "x-refresh-token": refreshToken,
          },
        },
        api,
        extraOptions
      );
      console.log("this is refresh Result", refreshResult);
      if (refreshResult?.data) {
        const newAccessToken = refreshResult.data.accessToken;

        // save new token
        await SecureStore.setItemAsync("accessToken", newAccessToken);

        // update Redux auth state
        api.dispatch(
          setCredentials({
            accessToken: newAccessToken,
            user: refreshResult.data, // adjust based on your API response
          })
        );

        // retry original request
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logOut());
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
      }
    } catch (error) {
      console.error("Refresh failed:", error);
      api.dispatch(logOut());
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["UserFood"],
  endpoints: (builder) => ({}), // extend later
});
