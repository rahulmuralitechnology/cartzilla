import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DashboardStats } from "../../services/interfaces/dashboard";

interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  formOpen: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  loading: false,
  formOpen: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashboardData: (state, action: PayloadAction<any>) => {
      state.stats = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setDashboardData, setLoading } = dashboardSlice.actions;

export default dashboardSlice.reducer;
