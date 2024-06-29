import statisticsAPI from "@apis/statisticsAPI";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchRevenueStatistics = createAsyncThunk(
  "statistics/fetchRevenueStatistics",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await statisticsAPI.get({ params, prefix: "/revenue" });
      return response;
    } catch (error) {
      const message = error?.response?.data.message ?? error?.message;
      return rejectWithValue(message);
    }
  }
);

export const fetchFootballBookedCountStats = createAsyncThunk(
  "statistics/fetchFootballBookedCountStats",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await statisticsAPI.get({
        params,
        prefix: "/football-booked",
      });
      return response;
    } catch (error) {
      const message = error?.response?.data.message ?? error?.message;
      return rejectWithValue(message);
    }
  }
);

export const fetchUserBookingCountStats = createAsyncThunk(
  "statistics/fetchUserBookingCountStats",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await statisticsAPI.get({
        params,
        prefix: "/user-bookings",
      });
      return response;
    } catch (error) {
      const message = error?.response?.data.message ?? error?.message;
      return rejectWithValue(message);
    }
  }
);
