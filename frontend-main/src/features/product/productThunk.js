import productAPI from "@apis/productAPI";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";

export const fetchAllProduct = createAsyncThunk(
  "product/fetchAllProduct",
  async (params = {}, { rejectWithValue, dispatch }) => {
    try {
      const response = await productAPI.get({ params });
      return response;
    } catch (error) {
      const message = error?.response?.data.message ?? error?.message;
      return rejectWithValue(message);
    }
  }
);

export const fetchAddProduct = createAsyncThunk(
  "product/fetchAddProduct",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await productAPI.postForm(data);
      toast.success(response.message);
      dispatch(fetchAllProduct({ page: 1, limit: 5 }));
      return response;
    } catch (error) {
      const message = error?.response?.data.message ?? error?.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchEditProduct = createAsyncThunk(
  "product/fetchEditProduct",
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const response = await productAPI.patchForm(id, data);
      toast.success(response.message);
      dispatch(fetchAllProduct({ page: 1, limit: 5 }));
      return response;
    } catch (error) {
      const message = error?.response?.data.message ?? error?.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchDeleteProduct = createAsyncThunk(
  "product/fetchDeleteProduct",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await productAPI.delete(id);
      toast.success(response.message);
      return response;
    } catch (error) {
      const message = error?.response?.data.message ?? error?.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);
