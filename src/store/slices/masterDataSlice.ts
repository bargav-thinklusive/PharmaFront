import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import MasterDataService from '../../services/MasterDataService';

const masterDataService = new MasterDataService();

export interface MasterDataState {
  therapeuticAreas: Record<string, string[]>;
  regionsCountries: Record<string, string[]>;
  regulatoryAuthorities: any[];
  loading: boolean;
  error: string | null;
}

const initialState: MasterDataState = {
  therapeuticAreas: {},
  regionsCountries: {},
  regulatoryAuthorities: [],
  loading: false,
  error: null,
};

export const fetchMasterData = createAsyncThunk(
  'masterData/fetchMasterData',
  async (_, { rejectWithValue }) => {
    try {
      const [ta, rc, ra] = await Promise.all([
        masterDataService.getTherapeuticAreas(),
        masterDataService.getRegionsCountries(),
        masterDataService.getRegulatoryAuthorities(),
      ]);
      return {
        therapeuticAreas: ta || {},
        regionsCountries: rc || {},
        regulatoryAuthorities: ra || [],
      };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch master data');
    }
  }
);

export const updateTherapeuticAreas = createAsyncThunk(
  'masterData/updateTherapeuticAreas',
  async (payload: Record<string, string[]>, { dispatch, rejectWithValue }) => {
    try {
      await masterDataService.getTherapeuticAreas();
      await dispatch(fetchMasterData());
      return payload;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update therapeutic areas');
    }
  }
);

export const updateRegionsCountries = createAsyncThunk(
  'masterData/updateRegionsCountries',
  async (payload: Record<string, string[]>, { dispatch, rejectWithValue }) => {
    try {
      await masterDataService.getRegionsCountries();
      await dispatch(fetchMasterData());
      return payload;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update regions and countries');
    }
  }
);

export const updateRegulatoryAuthorities = createAsyncThunk(
  'masterData/updateRegulatoryAuthorities',
  async (payload: any[], { dispatch, rejectWithValue }) => {
    try {
      await masterDataService.getRegulatoryAuthorities();
      await dispatch(fetchMasterData());
      return payload;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update regulatory authorities');
    }
  }
);

export const masterDataSlice = createSlice({
  name: 'masterData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Master Data
      .addCase(fetchMasterData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMasterData.fulfilled, (state, action) => {
        state.loading = false;
        state.therapeuticAreas = action.payload.therapeuticAreas;
        state.regionsCountries = action.payload.regionsCountries;
        state.regulatoryAuthorities = action.payload.regulatoryAuthorities;
      })
      .addCase(fetchMasterData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Therapeutic Areas
      .addCase(updateTherapeuticAreas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTherapeuticAreas.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateTherapeuticAreas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Regions & Countries
      .addCase(updateRegionsCountries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRegionsCountries.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateRegionsCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Regulatory Authorities
      .addCase(updateRegulatoryAuthorities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRegulatoryAuthorities.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateRegulatoryAuthorities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default masterDataSlice.reducer;
