import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type NavigationGuardState = {
  isDirty: boolean;
};

const initialState: NavigationGuardState = {
  isDirty: false,
};

const navigationGuardSlice = createSlice({
  name: 'navigationGuard',
  initialState,
  reducers: {
    setFormDirty: (state, action: PayloadAction<boolean>) => {
      state.isDirty = action.payload;
    },
  },
});

export const { setFormDirty } = navigationGuardSlice.actions;

/** True while any form on the page reports unsaved changes. */
export const selectIsFormDirty = (state: {
  navigationGuard: NavigationGuardState;
}) => state.navigationGuard.isDirty;

export default navigationGuardSlice.reducer;
