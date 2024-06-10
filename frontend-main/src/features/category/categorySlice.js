import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import {
  fetchAddCategory,
  fetchAllCategory,
  fetchDeleteCategory,
  fetchEditCategory,
} from "./categoryThunk";

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

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setFilterCategory: (state, { payload }) => {
      state.filters = { ...payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllCategory.pending, (state, action) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(fetchAllCategory.fulfilled, (state, { payload }) => {
      state.pagination = {
        limit: payload.options.limit,
        page: payload.options.page,
        totalPage: payload.options.totalRows,
      };
      state.data = payload.metadata;
      state.loading = false;
    });
    builder.addCase(fetchAllCategory.rejected, (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    });

    builder.addCase(fetchAddCategory.pending, (state, action) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(fetchAddCategory.fulfilled, (state, { payload }) => {
      state.error = "";
      state.loading = false;
    });
    builder.addCase(fetchAddCategory.rejected, (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    });

    builder.addCase(fetchEditCategory.pending, (state, action) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(fetchEditCategory.fulfilled, (state, { payload }) => {
      state.error = "";
      state.loading = false;
    });
    builder.addCase(fetchEditCategory.rejected, (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    });

    builder.addCase(fetchDeleteCategory.pending, (state, action) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(fetchDeleteCategory.fulfilled, (state, { payload }) => {
      state.error = "";
      state.loading = false;
    });
    builder.addCase(fetchDeleteCategory.rejected, (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    });
  },
});

export const { setFilterCategory } = categorySlice.actions;
export const useCategory = () => useSelector((state) => state.category);
export default categorySlice.reducer;
