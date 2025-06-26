import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PropertyFilters, SortBy, SortOrder } from '@/@types/property';

interface PropertyState {
  filters: PropertyFilters;
  isLoading: boolean;
  error: string | null;
}

const initialState: PropertyState = {
    filters: {
        search: '',
        min_price: undefined,
        max_price: undefined,
        property_type: undefined,
        bedrooms: undefined,
        bathrooms: undefined,
        state: undefined,
        // location_area: undefined,
        amenities: [],
        listing_type: undefined,  // New: Support for listing type filtering
        sort_by: SortBy.CREATED_AT,
        sort_order: SortOrder.DESC,
        page: 1,
        limit: 12
      },
  isLoading: false,
  error: null
};

const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<PropertyFilters>>) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
        page: action.payload.page || 1
      };
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    }
  }
});

export const { setFilters, setPage, resetFilters } = propertySlice.actions;
export default propertySlice;
