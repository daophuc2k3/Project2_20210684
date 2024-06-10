import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { fetchAllUser, fetchEditUser } from "./userThunk";

const initialState = {
  data: [],
  pagination: {
    page: 1,
    limit: 5,
    totalPage: 10,
  },
  filters: {
    page: 1,
    limit: 5,
  },
  error: "",
  loading: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setFilterUser: (state, { payload }) => {
      state.filters = { ...payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllUser.pending, (state, action) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(fetchAllUser.fulfilled, (state, { payload }) => {
      state.pagination = {
        limit: payload.options.limit,
        page: payload.options.page,
        totalPage: payload.options.totalRows,
      };
      state.data = payload.metadata;
      state.loading = false;
    });
    builder.addCase(fetchAllUser.rejected, (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    });

    builder.addCase(fetchEditUser.pending, (state, action) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(fetchEditUser.fulfilled, (state, { payload }) => {
      state.error = "";
      state.loading = false;
    });
    builder.addCase(fetchEditUser.rejected, (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    });
  },
});

export const { setFilterUser } = userSlice.actions;
export const useUser = () => useSelector((state) => state.user);
export default userSlice.reducer;
