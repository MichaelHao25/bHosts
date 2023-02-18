import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IRootState } from '../../store/IRootState';

interface ISingleState {
  password?: string;
  hostContent?: string;
}

const initialState: ISingleState = {};
const singleSlice = createSlice({
  name: 'singleSlice',
  initialState,
  reducers: {
    /**
     * 更新密码
     * @param state
     * @param action
     */
    setSinglePassword: (
      state,
      action: PayloadAction<Pick<ISingleState, 'password'>>
    ) => {
      const { payload } = action;
      const { password } = payload;
      if (password) {
        state.password = password;
      }
    },
    /**
     * 更新host内容
     * @param state
     * @param action
     */
    setSingleHostContent: (
      state,
      action: PayloadAction<Pick<ISingleState, 'hostContent'>>
    ) => {
      const { payload } = action;
      const { hostContent } = payload;
      if (hostContent) {
        state.hostContent = hostContent;
      }
    }
  }
});

export const {
  setSinglePassword,
  setSingleHostContent
} = singleSlice.actions;
export const singleSlicePassword = (state: IRootState) => state.single.password;
export const singleSliceHostContent = (state: IRootState) =>
  state.single.hostContent;

export default singleSlice.reducer;
