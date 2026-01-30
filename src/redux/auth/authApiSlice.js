import { apiSlice } from "../../app/api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    tagTypes: [{ type: 'profileData' }],
    endpoints: (builder) => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/login',
                method: 'POST',
                body: { ...credentials },
            }),
            keepUnusedDataFor: 5,
        }),
        signup: builder.mutation({
            query: (body) => ({
                url: '/signup',
                method: 'POST',
                body,
            }),
        }),
        verifyAccount: builder.mutation({
            query: (body) => ({
                url: '/verify-account',
                method: 'POST',
                body,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/logout',
                method: 'POST',
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useSignupMutation,
    useVerifyAccountMutation,
    useLogoutMutation,
    useUpdateUserProfileMutation,
    useDeleteUserMutation,
    useGetUserProfileQuery
} = authApiSlice;