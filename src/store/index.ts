import { configureStore } from "@reduxjs/toolkit";
// reducer import
import userReducer from "./reducers/userReducer";
import productSlice from "./reducers/productSlice";
import storeSlice from "./reducers/storeSlice";
import solutionReducer from "./reducers/solutionReducer";
import orderSlice from "./reducers/orderSlice";
import dashboardSlice from "./reducers/dashboardSlice";

// ==============================|| REDUX - MAIN STORE ||============================== //

const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  reducer: {
    user: userReducer,
    solutionReducer: solutionReducer,
    product: productSlice,
    store: storeSlice,
    orders: orderSlice,
    dashboard: dashboardSlice,
  },
});
const persister = "Free";

export { store, persister };
export type RootState = ReturnType<typeof store.getState>;
