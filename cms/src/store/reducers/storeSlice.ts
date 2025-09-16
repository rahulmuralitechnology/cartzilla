import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IStore } from "../../services/storeService";
import { StoreSiteConfig } from "../../services/interfaces/siteConfig";
import { SiteTypeConfig } from "../../services/siteConfigService";
import { EmailNotificationProps } from "../../services/interfaces/emailNotification";
import { Reservation } from "../../services/interfaces/restaurant";
import { ISiteType, IWebsiteType, TemplateVersion } from "../../services/interfaces/common";
import { Template } from "../../services/interfaces/template";

interface StoreState {
  stores: IStore[];
  loading: boolean;
  formOpen: boolean;
  error: string | null;
  selectedStore: IStore | null;
  currentStep: number;
  siteConfig: SiteTypeConfig | null;
  refresh: boolean;
  storeEmails: EmailNotificationProps[];
  reservation: Reservation[];
  selectedSiteType: ISiteType;
  selectedTemplate: string;
  selectedPlanId: string;
  publishing: boolean;
  templateVersions: string;
  templateList: Template[];
}

const initialState: StoreState = {
  stores: [],
  loading: false,
  formOpen: false,
  error: null,
  selectedStore: null,
  selectedSiteType: "website",
  selectedTemplate: "",
  refresh: false,
  siteConfig: null,
  currentStep: 0,
  storeEmails: [],
  reservation: [],
  publishing: false,
  templateVersions: "0.0.1",
  selectedPlanId: "",
  templateList: [],
};

const storeSlice = createSlice({
  name: "stores",
  initialState,
  reducers: {
    setStores: (state, action: PayloadAction<IStore[]>) => {
      state.stores = action.payload;
    },
    addStore: (state, action: PayloadAction<IStore>) => {
      state.stores.push(action.payload);
    },
    updateStore: (state, action: PayloadAction<IStore>) => {
      const index = state.stores.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.stores[index] = action.payload;
      }
    },
    deleteStore: (state, action: PayloadAction<string>) => {
      state.stores = state.stores.filter((s) => s.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    onSetRefresh: (state, action: PayloadAction<boolean>) => {
      state.refresh = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFormOpen: (state, action: PayloadAction<boolean>) => {
      state.formOpen = action.payload;
    },
    setSiteConfig: (state, action: PayloadAction<SiteTypeConfig>) => {
      state.siteConfig = action.payload;
    },
    setSelectedStoreId: (state, action: PayloadAction<IStore | null>) => {
      state.selectedStore = action.payload;
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setAllEmails: (state, action: PayloadAction<EmailNotificationProps[]>) => {
      state.storeEmails = action.payload;
    },
    setAllReservation: (state, action: PayloadAction<Reservation[]>) => {
      state.reservation = action.payload;
    },
    setAllTemplates: (state, action: PayloadAction<Template[]>) => {
      state.templateList = action.payload;
    },

    setSelectedSiteType: (state, action: PayloadAction<ISiteType>) => {
      state.selectedSiteType = action.payload;
    },
    setSelectedTemplate: (state, action) => {
      state.selectedTemplate = action.payload;
    },
    setIsPublishing: (state, action: PayloadAction<boolean>) => {
      state.publishing = action.payload;
    },
    setTemplateVersions: (state, action: PayloadAction<string>) => {
      state.templateVersions = action.payload;
    },

    setSelectedPlanId: (state, action: PayloadAction<string>) => {
      state.selectedPlanId = action.payload;
    },
  },
});

export const {
  onSetRefresh,
  setStores,
  addStore,
  updateStore,
  deleteStore,
  setLoading,
  setError,
  setFormOpen,
  setSelectedStoreId,
  setSiteConfig,
  setCurrentStep,
  setAllEmails,
  setAllReservation,
  setSelectedSiteType,
  setSelectedTemplate,
  setIsPublishing,
  setTemplateVersions,
  setAllTemplates,
  setSelectedPlanId,
} = storeSlice.actions;

export default storeSlice.reducer;
