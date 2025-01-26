import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const saveDraft = createAsyncThunk(
  'property/saveDraft',
  async (formData) => {
    // API call to save draft
    return formData;
  }
);

export const createListing = createAsyncThunk(
  'property/createListing',
  async (propertyData) => {
    // API call to create listing
    return propertyData;
  }
);

const propertySlice = createSlice({
  name: 'property',
  initialState: {
    drafts: [],
    listings: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(saveDraft.fulfilled, (state, action) => {
        state.drafts.push(action.payload);
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.listings.push(action.payload);
      });
  }
});

export default propertySlice.reducer;