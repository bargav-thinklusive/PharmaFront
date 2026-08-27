import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../services/shared/AxiosService';
import DrugService from '../../services/DrugService';

const drugService = new DrugService();

export interface DrugsState {
  drugsData: any[];
  drugsLoading: boolean;
  selectedList: 'fda' | 'cmcintel';
  error: string | null;
}

const initialState: DrugsState = {
  drugsData: [],
  drugsLoading: false,
  selectedList: 'fda',
  error: null,
};

export const fetchDrugs = createAsyncThunk(
  'drugs/fetchDrugs',
  async (_force: boolean | void, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(drugService.getDrugs());
      const data = response.data;
      return Array.isArray(data) ? data : (data?.data || []);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to fetch drugs');
    }
  },
  {
    condition: (force, { getState }) => {
      if (force === true) return true;
      const state = getState() as { drugs: DrugsState };
      if (state.drugs.drugsLoading || (state.drugs.drugsData && state.drugs.drugsData.length > 0)) {
        return false;
      }
    }
  }
);

export const createDrug = createAsyncThunk(
  'drugs/createDrug',
  async (payload: any, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(drugService.createDrug(), payload);
      await dispatch(fetchDrugs());
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to create drug');
    }
  }
);

export const updateDrug = createAsyncThunk(
  'drugs/updateDrug',
  async ({ id, payload }: { id: string; payload: any }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(drugService.updateDrug(id), payload);
      await dispatch(fetchDrugs());
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to update drug');
    }
  }
);

export const deleteDrug = createAsyncThunk(
  'drugs/deleteDrug',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(drugService.deleteDrug(id));
      await dispatch(fetchDrugs());
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to delete drug');
    }
  }
);

export const drugsSlice = createSlice({
  name: 'drugs',
  initialState,
  reducers: {
    setSelectedList: (state, action: PayloadAction<'fda' | 'cmcintel'>) => {
      state.selectedList = action.payload;
    },
    setDrugsData: (state, action: PayloadAction<any[]>) => {
      state.drugsData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDrugs.pending, (state) => {
        state.drugsLoading = true;
        state.error = null;
      })
      .addCase(fetchDrugs.fulfilled, (state, action) => {
        state.drugsLoading = false;
        state.drugsData = action.payload;
      })
      .addCase(fetchDrugs.rejected, (state, action) => {
        state.drugsLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createDrug.pending, (state) => {
        state.drugsLoading = true;
        state.error = null;
      })
      .addCase(createDrug.fulfilled, (state) => {
        state.drugsLoading = false;
      })
      .addCase(createDrug.rejected, (state, action) => {
        state.drugsLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateDrug.pending, (state) => {
        state.drugsLoading = true;
        state.error = null;
      })
      .addCase(updateDrug.fulfilled, (state) => {
        state.drugsLoading = false;
      })
      .addCase(updateDrug.rejected, (state, action) => {
        state.drugsLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteDrug.pending, (state) => {
        state.drugsLoading = true;
        state.error = null;
      })
      .addCase(deleteDrug.fulfilled, (state) => {
        state.drugsLoading = false;
      })
      .addCase(deleteDrug.rejected, (state, action) => {
        state.drugsLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedList, setDrugsData } = drugsSlice.actions;
export default drugsSlice.reducer;
