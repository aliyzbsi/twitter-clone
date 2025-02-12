import api, { authAPI } from "@/service/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Async thunks
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(email, password);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getCurrentUser();
      return response;
    } catch (error) {
      localStorage.removeItem("auth"); // Token geçersizse sil
      return rejectWithValue(
        error.response?.data?.message || "Failed to get user"
      );
    }
  }
);
export const getUserById = createAsyncThunk(
  "auth/getByUserId",
  async (userID, { rejectWithValue }) => {
    try {
      const response = await api.get(`/user/${userID}`);
      if (response) {
        toast.success("Kullanıcı bulundu");

        return response.data;
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Kullanıcı getirilirken bir hata oluştu"
      );
      return rejectWithValue(error.response?.data);
    }
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    profileUser: null,
    selectedUserId: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("auth");
    },
    clearProfileUser: (state) => {
      state.profileUser = null;
    },
    setSelectedUserId: (state, action) => {
      state.selectedUserId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.profileUser = action.payload;
        state.loading = false;
      })
      .addCase(getUserById.rejected, (state) => {
        state.profileUser = null;
        state.loading = false;
      });
  },
});

export const { logout, clearProfileUser, setSelectedUserId } =
  authSlice.actions;
export default authSlice.reducer;
