import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface ModalState {
  [key: string]: boolean
}

const initialState: ModalState = {}

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    open: (state, action: PayloadAction<string>): void => {
      state[action.payload] = true
    },
    close: (state, action: PayloadAction<string>): void => {
      state[action.payload] = false
    },
    closeAll: (state): void => {
      Object.keys(state).forEach((modalName: string) => {
        state[modalName] = false
      })
    }
  }
})

export const { close, closeAll, open } = modalSlice.actions

export default modalSlice.reducer
