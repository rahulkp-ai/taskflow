import { apiSlice } from "../apiSlice";

const USER_URL = "/user";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/profile`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getTeamList: builder.query({
      query: ({ search }) => ({
        url: `${USER_URL}/get-team?search=${search ?? ""}`,
      }),
      providesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USER_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    userAction: builder.mutation({
      query: ({ id, isActive }) => ({
        url: `${USER_URL}/${id}`,
        method: "PUT",
        body: { isActive },
      }),
      invalidatesTags: ["User"],
    }),
    getNotifications: builder.query({
      query: () => `${USER_URL}/notifications`,
      providesTags: ["Notification"],
    }),
    markNotiAsRead: builder.mutation({
      query: ({ id, type }) => ({
        url: `${USER_URL}/read-noti?isReadType=${type}&id=${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Notification"],
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/change-password`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useUpdateUserMutation,
  useGetTeamListQuery,
  useDeleteUserMutation,
  useUserActionMutation,
  useGetNotificationsQuery,
  useMarkNotiAsReadMutation,
  useChangePasswordMutation,
} = userApiSlice;
