import { apiSlice } from "../apiSlice";

const TASKS_URL = "/task";

export const taskApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => `${TASKS_URL}/dashboard`,
      providesTags: ["Task"],
    }),
    getAllTask: builder.query({
      query: ({ strQuery, isTrashed, search }) => ({
        url: `${TASKS_URL}?stage=${strQuery}&isTrashed=${isTrashed}&search=${search ?? ""}`,
      }),
      providesTags: ["Task"],
    }),
    createTask: builder.mutation({
      query: (data) => ({
        url: `${TASKS_URL}/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Task"],
    }),
    duplicateTask: builder.mutation({
      query: (id) => ({
        url: `${TASKS_URL}/duplicate/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Task"],
    }),
    updateTask: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${TASKS_URL}/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Task"],
    }),
    updateTaskStage: builder.mutation({
      query: ({ id, stage }) => ({
        url: `${TASKS_URL}/change-stage/${id}`,
        method: "PUT",
        body: { stage },
      }),
      invalidatesTags: ["Task"],
    }),
    trashTask: builder.mutation({
      query: ({ id }) => ({
        url: `${TASKS_URL}/trash/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Task"],
    }),
    deleteRestoreTask: builder.mutation({
      query: ({ id, actionType }) => ({
        url: `${TASKS_URL}/delete-restore/${id}?actionType=${actionType}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Task"],
    }),
    getSingleTask: builder.query({
      query: (id) => `${TASKS_URL}/${id}`,
      providesTags: ["Task"],
    }),
    postActivity: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${TASKS_URL}/activity/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Task"],
    }),
    createSubTask: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${TASKS_URL}/create-subtask/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Task"],
    }),
    updateSubTaskStage: builder.mutation({
      query: ({ taskId, subTaskId, status }) => ({
        url: `${TASKS_URL}/${taskId}/subtask/${subTaskId}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Task"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetAllTaskQuery,
  useCreateTaskMutation,
  useDuplicateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStageMutation,
  useTrashTaskMutation,
  useDeleteRestoreTaskMutation,
  useGetSingleTaskQuery,
  usePostActivityMutation,
  useCreateSubTaskMutation,
  useUpdateSubTaskStageMutation,
} = taskApiSlice;
