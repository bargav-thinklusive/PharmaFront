import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../services/shared/AxiosService';
import UserService from '../../services/UserService';
import TokenService from '../../services/shared/TokenService';
import AuthService from '../../services/AuthService';

const userService = new UserService();
const tokenService = TokenService;

export interface UserState {
  user: any | null;
  userLoading: boolean;
  roles: string[];
  error: string | null;
}

const initialState: UserState = {
  user: null,
  userLoading: false,
  roles: [],
  error: null,
};

export const checkTokenAndFetchUser = createAsyncThunk(
  'user/checkTokenAndFetchUser',
  async (_force: boolean | void, { rejectWithValue }) => {
    try {
      let token = tokenService.getToken();
      if (!token) {
        token = await tokenService.refreshToken();
      }
      if (token) {
        const id = tokenService.decodeToken()?.sub;
        if (id) {
          const response = await axiosInstance.get(userService.getUserById(id));
          return response.data;
        }
      }
      return null;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to fetch user');
    }
  },
  {
    condition: (force, { getState }) => {
      if (force === true) return true;
      const state = getState() as { user: UserState };
      if (state.user.userLoading || state.user.user) {
        return false;
      }
    }
  }
);

export const createUser = createAsyncThunk(
  'user/createUser',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(userService.createUser(), payload);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to create user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ id, payload }: { id: string; payload: any }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(userService.updateUser(id), payload);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(userService.deleteUser(id));
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to delete user');
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      state.roles = action.payload?.data?.roles ?? AuthService.getUserRoles();
    },
    clearUser: (state) => {
      state.user = null;
      state.roles = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user
      .addCase(checkTokenAndFetchUser.pending, (state) => {
        state.userLoading = true;
        state.error = null;
      })
      .addCase(checkTokenAndFetchUser.fulfilled, (state, action) => {
        state.userLoading = false;
        state.user = action.payload;
        state.roles = action.payload?.data?.roles ?? AuthService.getUserRoles();
      })
      .addCase(checkTokenAndFetchUser.rejected, (state, action) => {
        state.userLoading = false;
        state.error = action.payload as string;
      })
      // Create user
      .addCase(createUser.pending, (state) => {
        state.userLoading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.userLoading = false;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.userLoading = false;
        state.error = action.payload as string;
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.userLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.userLoading = false;
        if (action.payload?.data) {
          state.user = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.userLoading = false;
        state.error = action.payload as string;
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.userLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.userLoading = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.userLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
