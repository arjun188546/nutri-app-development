import { apiSlice } from "../../app/api/apiSlice";

const authenticateApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        authenticate: builder.query({
            query: () => {
                return '/authenticate'
            },
            // keepUnusedDataFor: 5,
        })
    })
});

export const { useAuthenticateQuery } = authenticateApiSlice;
