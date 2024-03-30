import { createSlice } from "@reduxjs/toolkit";

const initialstate = { 
    currentuser: null,
    error:null,
    loading: false
}

const userSlice = createSlice({
  name: "user",
  initialState: initialstate,
  reducers: {
      signStart: (state)=>{
        state.loading = true;
      },
      signinSuccess: (state, action)=>{
        state.loading = false;
        state.currentuser = action.payload;
        state.error = null;
      },
      signinFailure: (state, action)=>{
          state.loading = false;
          state.currentuser = null;
          state.error = action.payload;
      },
      updateuserStart: (state)=>{
        state.loading = true;
      },
      updateuserSuccess: (state,action)=>{
        state.loading = false;
        state.error = null;
        state.currentuser = action.payload;
      },
      updateUserFailure: (state, action)=>{
          state.loading = false;
          state.error = action.payload;
      },
      deluserStart: (state)=>{
        state.loading = true;
      },
      deluserSuccess: (state)=>{
        state.loading = false;
        state.error = null;
        state.currentuser = null;
      },
      deluserFailure: (state, action)=>{
          state.loading = false;
          state.error = action.payload;
      },
      signOutuserStart: (state)=>{
        state.loading = true;
      },
      signOutuserSuccess: (state)=>{
        state.loading = false;
        state.error = null;
        state.currentuser = null;
      },
      signOutuserFailure: (state, action)=>{
          state.loading = false;
          state.error = action.payload;
      }
  }
})

export const { signStart, signinSuccess, signinFailure, updateuserStart, updateuserSuccess, updateUserFailure, deluserFailure,deluserSuccess,deluserStart, signOutuserFailure,signOutuserSuccess,signOutuserStart } = userSlice.actions;

export default userSlice.reducer;