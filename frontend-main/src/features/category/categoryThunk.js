import categoryAPI from "@apis/categoryAPI";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";

export const fetchAllCategory = createAsyncThunk(
  "category/fetchAllCategory",
  async (params = {}, { rejectWithValue, dispatch }) => {
    try {
      const response = await categoryAPI.get({ params });
      return response;
    } catch (error) {
      const message = error?.response?.data.message ?? error?.message;
      return rejectWithValue(message);
    }
  }
);

export const fetchAddCategory = createAsyncThunk(
  "category/fetchAddCategory",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await categoryAPI.post(data);
      toast.success(response.message);
      dispatch(fetchAllCategory({ page: 1, limit: 5 }));
      return response;
    } catch (error) {
      const message = error?.response?.data.message ?? error?.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchEditCategory = createAsyncThunk(
  "category/fetchEditCategory",
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const response = await categoryAPI.patch(id, data);
      toast.success(response.message);
      dispatch(fetchAllCategory({ page: 1, limit: 5 }));
      return response;
    } catch (error) {
      const message = error?.response?.data.message ?? error?.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchDeleteCategory = createAsyncThunk(
  "category/fetchDeleteCategory",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await categoryAPI.delete(id);
      toast.success(response.message);
      return response;
    } catch (error) {
      const message = error?.response?.data.message ?? error?.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateCategoryStatus = createAsyncThunk(
  "category/updateCategoryStatus",
  async ({ id, status }, { rejectWithValue, dispatch }) => {
    try {
      const response = await categoryAPI.post({ status }, `/${id}`);
      toast.success(response.message);
      return response;
    } catch (error) {
      const message = error?.response?.data.message ?? error?.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);
