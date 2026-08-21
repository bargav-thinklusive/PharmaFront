import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../services/shared/AxiosService';
import DraftService from '../../services/DraftService';

const draftService = new DraftService();

export interface DraftsState {
  drafts: any[];
  draftsLoading: boolean;
  error: string | null;
}

const initialState: DraftsState = {
  drafts: [],
  draftsLoading: false,
  error: null,
};

export const fetchDrafts = createAsyncThunk(
  'drafts/fetchDrafts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(draftService.getDrafts());
      const data = response.data;
      return Array.isArray(data) ? data : (data?.data || []);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to fetch drafts');
    }
  }
);

export const createDraft = createAsyncThunk(
  'drafts/createDraft',
  async (payload: any, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(draftService.saveDraft(), payload);
      await dispatch(fetchDrafts());
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to save draft');
    }
  }
);

export const deleteDraft = createAsyncThunk(
  'drafts/deleteDraft',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(draftService.deleteDraft(id));
      await dispatch(fetchDrafts());
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to delete draft');
    }
  }
);

export const draftsSlice = createSlice({
  name: 'drafts',
  initialState,
  reducers: {
    setDrafts: (state, action: PayloadAction<any[]>) => {
      state.drafts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDrafts.pending, (state) => {
        state.draftsLoading = true;
        state.error = null;
      })
      .addCase(fetchDrafts.fulfilled, (state, action) => {
        state.draftsLoading = false;
        state.drafts = action.payload;
      })
      .addCase(fetchDrafts.rejected, (state, action) => {
        state.draftsLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createDraft.pending, (state) => {
        state.draftsLoading = true;
        state.error = null;
      })
      .addCase(createDraft.fulfilled, (state) => {
        state.draftsLoading = false;
      })
      .addCase(createDraft.rejected, (state, action) => {
        state.draftsLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteDraft.pending, (state) => {
        state.draftsLoading = true;
        state.error = null;
      })
      .addCase(deleteDraft.fulfilled, (state) => {
        state.draftsLoading = false;
      })
      .addCase(deleteDraft.rejected, (state, action) => {
        state.draftsLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setDrafts } = draftsSlice.actions;
export default draftsSlice.reducer;
