import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import {
  fetchAddProduct,
  fetchAllProduct,
  fetchDeleteProduct,
  fetchEditProduct,
} from "./productThunk";

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

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setFilterProduct: (state, { payload }) => {
      state.filters = { ...payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllProduct.pending, (state, action) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(fetchAllProduct.fulfilled, (state, { payload }) => {
      state.pagination = {
        limit: payload.options.limit,
        page: payload.options.page,
        totalPage: payload.options.totalRows,
      };
      state.data = payload.metadata;
      state.loading = false;
    });
    builder.addCase(fetchAllProduct.rejected, (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    });

    builder.addCase(fetchAddProduct.pending, (state, action) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(fetchAddProduct.fulfilled, (state, { payload }) => {
      state.error = "";
      state.loading = false;
    });
    builder.addCase(fetchAddProduct.rejected, (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    });

    builder.addCase(fetchEditProduct.pending, (state, action) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(fetchEditProduct.fulfilled, (state, { payload }) => {
      state.error = "";
      state.loading = false;
    });
    builder.addCase(fetchEditProduct.rejected, (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    });

    builder.addCase(fetchDeleteProduct.pending, (state, action) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(fetchDeleteProduct.fulfilled, (state, { payload }) => {
      state.error = "";
      state.loading = false;
    });
    builder.addCase(fetchDeleteProduct.rejected, (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    });
  },
});

export const { setFilterProduct } = productSlice.actions;
export const useProduct = () => useSelector((state) => state.product);
export default productSlice.reducer;
