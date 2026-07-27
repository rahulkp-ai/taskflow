import { createSlice } from "@reduxjs/toolkit";

const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem("userInfo");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const getThemeFromStorage = () => {
  return localStorage.getItem("theme") || "light";
};

const initialState = {
  user: getUserFromStorage(),
  isSidebarOpen: false,
  theme: getThemeFromStorage(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("userInfo");
    },
    setOpenSidebar: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.theme);
    },
  },
});

export const { setCredentials, logout, setOpenSidebar, toggleTheme } =
  authSlice.actions;

export default authSlice.reducer;
