// Please note that this gist follows the repo available at: https://github.com/delasign/react-redux-tutorial
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../services/authService";

interface InitialState {
  user: any;
  clients: IUser[] | null;
  loading: boolean;
  userRefresh: boolean;
  currentChannel: any;
  selectedSideMenu: string;
  currentStep: number;
}

const initialState: InitialState = {
  user: {},
  clients: [],
  loading: true,
  userRefresh: false,
  currentChannel: {},
  selectedSideMenu: "dashboard",

  currentStep: 0,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      if (action.payload === null) {
        state.user = null;
      } else {
        state.user = { ...action.payload };
        state.loading = false;
      }
    },
    setCurrentChannel: (state, action) => {
      state.currentChannel = action.payload;
    },
    setUserRefresh: (state) => {
      state.userRefresh = !state.userRefresh;
    },
    setSelectedSideMenu: (state, action) => {
      state.selectedSideMenu = action.payload;
    },

    setStoreClients: (state, action) => {
      state.clients = action.payload;
    },
    setFlowStep: (state, action) => {
      state.currentStep = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, setUserRefresh, setCurrentChannel, setSelectedSideMenu, setStoreClients, setFlowStep } = userSlice.actions;
// You must export the reducer as follows for it to be able to be read by the store.
export default userSlice.reducer;
