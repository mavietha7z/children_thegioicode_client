import { createSlice } from '@reduxjs/toolkit';

const appReducer = createSlice({
    name: 'apps',
    initialState: {
        configs: null,
    },
    reducers: {
        dispatchConfigApps: (state, action) => {
            state.configs = action.payload;
        },
    },
});

export const { dispatchConfigApps } = appReducer.actions;

export default appReducer.reducer;
