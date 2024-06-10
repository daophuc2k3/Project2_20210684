import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import {
  fetchAddFootball,
  fetchAllFootball,
  fetchDeleteFootball,
  fetchEditFootball,
} from "./footballThunk";

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
    sort: "category,asc",
  },
  error: "",
  loading: false,
};

export const footballSlice = createSlice({
  name: "football",
  initialState,
  reducers: {
    setFilterFootball: (state, { payload }) => {
      state.filters = { ...payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllFootball.pending, (state, action) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(fetchAllFootball.fulfilled, (state, { payload }) => {
      state.pagination = {
        limit: payload.options.limit,
        page: payload.options.page,
        totalPage: payload.options.totalRows,
      };
      state.data = payload.metadata;
      state.loading = false;
    });
    builder.addCase(fetchAllFootball.rejected, (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    });

    builder.addCase(fetchAddFootball.pending, (state, action) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(fetchAddFootball.fulfilled, (state, { payload }) => {
      state.error = "";
      state.loading = false;
    });
    builder.addCase(fetchAddFootball.rejected, (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    });

    builder.addCase(fetchEditFootball.pending, (state, action) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(fetchEditFootball.fulfilled, (state, { payload }) => {
      state.error = "";
      state.loading = false;
    });
    builder.addCase(fetchEditFootball.rejected, (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    });

    builder.addCase(fetchDeleteFootball.pending, (state, action) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(fetchDeleteFootball.fulfilled, (state, { payload }) => {
      state.error = "";
      state.loading = false;
    });
    builder.addCase(fetchDeleteFootball.rejected, (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    });
  },
});

export const { setFilterFootball } = footballSlice.actions;
export const useFootball = () => useSelector((state) => state.football);
export default footballSlice.reducer;
