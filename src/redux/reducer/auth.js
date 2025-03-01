import { createSlice } from '@reduxjs/toolkit';

const authReducer = createSlice({
    name: 'auth',
    initialState: {
        currentUser: null,
    },
    reducers: {
        loginUserSuccess: (state, action) => {
            state.currentUser = action.payload;
        },
        logoutUserSuccess: (state) => {
            state.currentUser = null;
        },
    },
});

export const { loginUserSuccess, logoutUserSuccess } = authReducer.actions;

export default authReducer.reducer;
