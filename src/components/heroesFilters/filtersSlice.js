import {createSlice, createAsyncThunk, createEntityAdapter} from '@reduxjs/toolkit';
import { useHttp } from '../../hooks/http.hook';

const filtersAdapter = createEntityAdapter();

const initialState = filtersAdapter.getInitialState({
    filtersLoadingStatus: 'idle',
    activeFilter: 'all'
});

// const initialState = {
//     filters: [],
//     filtersLoadingStatus: 'idle',
//     activeFilter: 'all'
// }

export const filterHeroes = createAsyncThunk(
  'filters/filterHeroes',
  () => {
      const {request} = useHttp();
      return request("http://localhost:3001/filters");
  }
)

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        activeFilterChanged: (state, action) => {
             state.activeFilter = action.payload;
          }
    },
    extraReducers: (builder) => {
        builder
          .addCase(filterHeroes.pending, state => {state.filtersLoadingStatus = 'loading'})
          .addCase(filterHeroes.fulfilled, (state, action) => {
              state.filtersLoadingStatus = 'idle';
              filtersAdapter.setAll(state, action.payload);
          })
          .addCase(filterHeroes.rejected, state => {state.filtersLoadingStatus = 'error'})
          .addDefaultCase(() => {})
    }
});

const {actions, reducer} = filtersSlice;

export default reducer;

export const {selectAll} = filtersAdapter.getSelectors(state => state.filters);

export const {
    filtersFetching,
    filtersFetched,
    filtersFetchingError,
    activeFilterChanged
} = actions;
