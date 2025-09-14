import { createSlice } from "@reduxjs/toolkit";

// Function to safely get user data from localStorage
const getUserFromLocalStorage = () => {
    try {
        const userData = localStorage.getItem('authUser');
        if (userData) {
            return JSON.parse(userData);
        }
        return null;
    } catch (error) {
        console.error("Could not parse user data from localStorage", error);
        return null;
    }
};


const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        // Initialize the user state from localStorage on app load.
        user: getUserFromLocalStorage(),
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        // This action now handles both setting the user in Redux and persisting it.
        setUser: (state, action) => {
            const user = action.payload;
            state.user = user;
            
            // If the user data is provided, save it to localStorage.
            if (user) {
                localStorage.setItem('authUser', JSON.stringify(user));
            } else {
                // If the payload is null (logout), remove it from localStorage.
                localStorage.removeItem('authUser');
            }
        },
        // It's good practice to have a clear action for logging out.
        clearUser: (state) => {
            state.user = null;
            localStorage.removeItem('authUser');
        }
    }
});

export const { setLoading, setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;