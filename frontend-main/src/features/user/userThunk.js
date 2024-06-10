import userAPI from "@apis/userAPI";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";

export const fetchAllUser = createAsyncThunk(
  "user/fetchAllUser",
  async (params = {}, { rejectWithValue, dispatch }) => {
    try {
      const response = await userAPI.get({ params });
      return response;
    } catch (error) {
      const message = error?.response?.data.message ?? error?.message;
      return rejectWithValue(message);
    }
  }
);

export const fetchEditUser = createAsyncThunk(
  "user/fetchEditUser",
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const response = await userAPI.patchForm(id, data);
      toast.success(response.message);
      return response;
    } catch (error) {
      const message = error?.response?.data.message ?? error?.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);
