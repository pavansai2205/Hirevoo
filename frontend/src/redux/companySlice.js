import { createSlice } from "@reduxjs/toolkit";

const companySlice = createSlice({
    name: "company",
    initialState: {
        // The currently viewed or edited company.
        singleCompany: null,
        // The list of all companies for the admin panel. Default to an empty array for safety.
        companies: [],
        // The text used to filter the companies table.
        searchCompanyByText: "",
        // A boolean to track when an API call is in progress.
        loading: false,
        // A string to store any error messages from the API.
        error: null,
    },
    reducers: {
        // Reducer for a single company, often used for viewing or editing.
        setSingleCompany: (state, action) => {
            state.singleCompany = action.payload;
            state.loading = false;
            state.error = null;
        },
        // Reducer for the list of all companies.
        setCompanies: (state, action) => {
            state.companies = action.payload;
            state.loading = false;
            state.error = null;
        },
        // Reducer for the search/filter text.
        setSearchCompanyByText: (state, action) => {
            state.searchCompanyByText = action.payload;
        },
        // A dedicated reducer to control the loading state.
        setCompanyLoading: (state, action) => {
            state.loading = action.payload;
        },
        // A dedicated reducer to handle any errors.
        setCompanyError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    }
});

export const {
    setSingleCompany,
    setCompanies,
    setSearchCompanyByText,
    setCompanyLoading,
    setCompanyError
} = companySlice.actions;

export default companySlice.reducer;