import { IStore } from "../../services/storeService";
import { store } from "../index";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export interface StoreFormData extends Omit<IStore, "id" | "createdAt" | "updatedAt" | "userId"> {}
