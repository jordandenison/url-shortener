import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

const debounceThreshold = 2500

export type ToastTypes = 'info' | 'success' | 'alert' | 'error'

export interface Toast {
  id: string
  type: ToastTypes
  message: string
  created: number
}

export interface ToastsState {
  data: Toast[]
}

const initialState: ToastsState = {
  data: []
}

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    createToast: (state, action: PayloadAction<{ type: ToastTypes; message: string }>): void => {
      const notificationExists = state.data.find((notification: Toast) => {
        return (
          notification.message === action.payload.message && notification.type === action.payload.type && Date.now() - notification.created < debounceThreshold
        )
      })
      if (!notificationExists) {
        const newToast = {
          id: uuidv4(),
          created: Date.now(),
          type: action.payload.type,
          message: action.payload.message
        }
        state.data.push(newToast)
      }
    },
    removeToast: (state, action: PayloadAction<{ id: string }>): void => {
      const index = state.data.findIndex((notification: Toast) => {
        return notification.id === action.payload.id
      })
      if (index !== -1) {
        state.data.splice(index, 1)
      }
    },
    resetToasts: (state): void => {
      state.data = []
    }
  }
})

export const { createToast, removeToast, resetToasts } = notificationsSlice.actions

export default notificationsSlice.reducer
