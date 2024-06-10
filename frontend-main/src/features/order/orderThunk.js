import orderAPI from "@apis/orderAPI";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";

export const fetchAllOrder = createAsyncThunk(
  "order/fetchAllOrder",
  async (params = {}, { rejectWithValue, dispatch }) => {
    try {
      const response = await orderAPI.get({ params });
      return response;
    } catch (error) {
      const message = error?.response?.data.message ?? error?.message;
      return rejectWithValue(message);
    }
  }
);

export const fetchAddOrder = createAsyncThunk(
  "order/fetchAddOrder",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await orderAPI.post(data);
      toast.success(response.message);
      dispatch(fetchAllOrder({ page: 1, limit: 5 }));
      return response;
    } catch (error) {
      const message = error?.response?.data.message ?? error?.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchFilterDatesByTime = createAsyncThunk(
  "order/fetchFilterDatesByTime",
  async (params, { rejectWithValue, dispatch }) => {
    try {
      const response = await orderAPI.get({ params, prefix: "/filter-date-by-time" });
      return response;
    } catch (error) {
      const message = error?.response?.data.message ?? error?.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchChangeStatus = createAsyncThunk(
  "order/fetchChangeStatus",
  async (orderDetailsId, { rejectWithValue, dispatch }) => {
    try {
      const response = await orderAPI.post(null, `/change-status/${orderDetailsId}`);
      toast.success(response.message);
      return response;
    } catch (error) {
      const message = error?.response?.data.message ?? error?.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const cancelOrderDetails = createAsyncThunk(
  "order/cancelOrderDetails",
  async (orderDetailsId, { rejectWithValue, dispatch }) => {
    try {
      const response = await orderAPI.post(null, `/cancel-order-details/${orderDetailsId}`);
      toast.success("Hủy đặt sân thành công");
      return response;
    } catch (error) {
      const message = error?.response?.data.message ?? error?.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchEditOrderDetails = createAsyncThunk(
  "order/fetchEditOrderDetails",
  async ({ data, orderDetailsId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await orderAPI.post(data, `/update-order-details/${orderDetailsId}`);
      toast.success(response.message);
      return response;
    } catch (error) {
      const message = error?.response?.data.message ?? error?.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);
