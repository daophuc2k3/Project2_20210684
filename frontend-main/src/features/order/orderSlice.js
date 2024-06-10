import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import {
  fetchAllOrder,
  fetchChangeStatus,
  fetchEditOrderDetails,
  fetchFilterDatesByTime,
} from "./orderThunk";

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
  isFetching: false,
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setFilterOrder: (state, { payload }) => {
      state.filters = { ...payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllOrder.pending, (state, action) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(fetchAllOrder.fulfilled, (state, { payload }) => {
      state.pagination = {
        limit: payload.options.limit,
        page: payload.options.page,
        totalPage: payload.options.totalRows,
      };
      state.data = payload.metadata;
      state.loading = false;
    });
    builder.addCase(fetchAllOrder.rejected, (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    });

    builder.addCase(fetchFilterDatesByTime.pending, (state, action) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(fetchFilterDatesByTime.fulfilled, (state, { payload }) => {
      state.error = "";
      state.loading = false;
    });
    builder.addCase(fetchFilterDatesByTime.rejected, (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    });

    builder.addCase(fetchChangeStatus.pending, (state, action) => {
      state.isFetching = true;
      state.error = "";
    });
    builder.addCase(fetchChangeStatus.fulfilled, (state, { payload }) => {
      state.error = "";
      state.isFetching = false;
    });
    builder.addCase(fetchChangeStatus.rejected, (state, { payload }) => {
      state.error = payload;
      state.isFetching = false;
    });

    builder.addCase(fetchEditOrderDetails.pending, (state, action) => {
      state.isFetching = true;
      state.error = "";
    });
    builder.addCase(fetchEditOrderDetails.fulfilled, (state, { payload }) => {
      state.error = "";
      state.isFetching = false;
    });
    builder.addCase(fetchEditOrderDetails.rejected, (state, { payload }) => {
      state.error = payload;
      state.isFetching = false;
    });
  },
});

export const { setFilterOrder } = orderSlice.actions;
export const useOrder = () => useSelector((state) => state.order);
export default orderSlice.reducer;
