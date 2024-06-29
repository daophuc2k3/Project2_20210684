import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import {
  fetchFootballBookedCountStats,
  fetchRevenueStatistics,
  fetchUserBookingCountStats,
} from "./statisticsThunk";

const initialState = {
  revenueStatistics: {},
  footballBooked: [],
  userBookingCount: [],
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

export const statisticsSlice = createSlice({
  name: "statistics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRevenueStatistics.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(fetchRevenueStatistics.fulfilled, (state, { payload }) => {
      state.revenueStatistics = payload.metadata;
      state.loading = false;
    });
    builder.addCase(fetchRevenueStatistics.rejected, (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    });

    builder.addCase(fetchFootballBookedCountStats.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(
      fetchFootballBookedCountStats.fulfilled,
      (state, { payload }) => {
        state.footballBooked = payload.metadata;
        state.loading = false;
      }
    );
    builder.addCase(
      fetchFootballBookedCountStats.rejected,
      (state, { payload }) => {
        state.error = payload;
        state.loading = false;
      }
    );

    builder.addCase(fetchUserBookingCountStats.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(
      fetchUserBookingCountStats.fulfilled,
      (state, { payload }) => {
        state.userBookingCount = payload.metadata;
        state.loading = false;
      }
    );
    builder.addCase(
      fetchUserBookingCountStats.rejected,
      (state, { payload }) => {
        state.error = payload;
        state.loading = false;
      }
    );
  },
});

export const useStatistics = () => useSelector((state) => state.statistics);
export default statisticsSlice.reducer;
