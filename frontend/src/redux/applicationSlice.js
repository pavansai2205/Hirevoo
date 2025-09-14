import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
    name: 'application',
    initialState: {
        // Use an empty array for safety when mapping in components.
        applicants: [],
        // A boolean to track when an API call is in progress.
        loading: false,
        // A string to store any error messages from the API.
        error: null,
    },
    reducers: {
        // Reducer to handle the successful fetching of applicants.
        setAllApplicants: (state, action) => {
            state.applicants = action.payload;
            state.loading = false; // Data has been loaded, so loading is complete.
            state.error = null;    // Clear any previous errors on success.
        },
        // A dedicated reducer to control the loading state.
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        // A dedicated reducer to handle any errors.
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false; // An error occurred, so loading is complete.
        },
        // You could also add reducers for single updates later, like this:
        updateApplicantStatus: (state, action) => {
            const { applicationId, status } = action.payload;
            const index = state.applicants.findIndex(app => app._id === applicationId);
            if (index !== -1) {
                state.applicants[index].status = status;
            }
        }
    }
});

// Export the new actions along with the existing one.
export const { setAllApplicants, setLoading, setError, updateApplicantStatus } = applicationSlice.actions;
export default applicationSlice.reducer;