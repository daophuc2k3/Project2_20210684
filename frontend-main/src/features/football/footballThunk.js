import footballAPI from "@apis/footballAPI";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";

export const fetchAllFootball = createAsyncThunk(
  "football/fetchAllFootball",
  async (params = {}, { rejectWithValue, dispatch }) => {
    try {
      const response = await footballAPI.get({ params });
      return response;
    } catch (error) {
      const message = error?.response?.data.message ?? error?.message;
      return rejectWithValue(message);
    }
  }
);

export const fetchAddFootball = createAsyncThunk(
  "football/fetchAddFootball",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await footballAPI.postForm(data);
      toast.success(response.message);
      dispatch(fetchAllFootball({ page: 1, limit: 5, sort: "category,asc" }));
      return response;
    } catch (error) {
      const message = error?.response?.data.message ?? error?.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchEditFootball = createAsyncThunk(
  "football/fetchEditFootball",
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const response = await footballAPI.patchForm(id, data);
      toast.success(response.message);
      dispatch(fetchAllFootball({ page: 1, limit: 5, sort: "category,asc" }));
      return response;
    } catch (error) {
      const message = error?.response?.data.message ?? error?.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchDeleteFootball = createAsyncThunk(
  "football/fetchDeleteFootball",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await footballAPI.delete(id);
      toast.success(response.message);
      return response;
    } catch (error) {
      const message = error?.response?.data.message ?? error?.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);
