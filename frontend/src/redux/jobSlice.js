import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name: "job",
    initialState: {
        allJobs: [],
        allAdminJobs: [],
        singleJob: null,
        searchJobByText: "",
        allAppliedJobs: [],
        searchedQuery: "",
        // Add loading and error states for robust UI feedback.
        loading: false,
        error: null,
    },
    reducers: {
        // Actions for setting data
        setAllJobs: (state, action) => {
            state.allJobs = action.payload;
            state.loading = false; // Data loaded, stop loading
            state.error = null;
        },
        setSingleJob: (state, action) => {
            state.singleJob = action.payload;
            state.loading = false;
            state.error = null;
        },
        setAllAdminJobs: (state, action) => {
            state.allAdminJobs = action.payload;
            state.loading = false;
            state.error = null;
        },
        setAllAppliedJobs: (state, action) => {
            state.allAppliedJobs = action.payload;
            state.loading = false;
            state.error = null;
        },

        // Actions for search and filter text (these are synchronous, no loading change)
        setSearchJobByText: (state, action) => {
            state.searchJobByText = action.payload;
        },
        setSearchedQuery: (state, action) => {
            state.searchedQuery = action.payload;
        },

        // Dedicated actions for loading and error states
        setJobLoading: (state, action) => {
            state.loading = action.payload;
        },
        setJobError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    }
});

export const {
    setAllJobs,
    setSingleJob,
    setAllAdminJobs,
    setSearchJobByText,
    setAllAppliedJobs,
    setSearchedQuery,
    setJobLoading,
    setJobError
} = jobSlice.actions;

export default jobSlice.reducer;