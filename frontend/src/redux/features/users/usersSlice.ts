import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Params } from '@feathersjs/feathers'

import client from '../../../lib/feathers/feathersClient'

import { createToast } from '../toasts/toastsSlice'

import type { User, UserData, UserPatch } from '../../../models/User'

export interface DataState {
  authenitcating: boolean
  loading: boolean
  modifying: boolean

  currentUser?: User
  errorMessage?: string
}

const initialState: DataState = {
  authenitcating: false,
  loading: false,
  modifying: false
}

interface ILoginParams {
  username?: string
  password?: string
}

interface ICreateParams {
  data: UserData
  params?: Params
}

interface IPatchParams {
  id: number
  data: UserPatch

  params?: Params
}

export const loginAsync = createAsyncThunk('users/login', async ({ username, password }: ILoginParams, { dispatch }): Promise<User> => {
  try {
    const result =
      username && password
        ? await client.authenticate({
            strategy: 'local',
            username,
            password
          })
        : await client.reAuthenticate()
    return result.user
  } catch (e: unknown) {
    dispatch(createToast({ type: 'error', message: `Error logging in: ${(e as Error).message}` }))
    throw e
  }
})

export const logoutAsync = createAsyncThunk('users/logout', async (_, { dispatch }): Promise<void> => {
  try {
    await client.logout()
  } catch (e: unknown) {
    dispatch(createToast({ type: 'error', message: `Error logging out: ${(e as Error).message}` }))
    throw e
  }
})

export const createAsync = createAsyncThunk('users/create', async ({ data, params }: ICreateParams, { dispatch }): Promise<User> => {
  try {
    return await client.service('users').create(data, params)
  } catch (e: unknown) {
    dispatch(createToast({ type: 'error', message: `Error creating user: ${(e as Error).message}` }))
    throw e
  }
})

export const patchAsync = createAsyncThunk('users/patch', async ({ id, data, params }: IPatchParams, { dispatch }): Promise<User> => {
  try {
    return await client.service('users').patch(id, data, params)
  } catch (e: unknown) {
    dispatch(createToast({ type: 'error', message: `Error updating user: ${(e as Error).message}` }))
    throw e
  }
})

const handleLoginPending = (state: DataState) => {
  delete state.currentUser
  state.authenitcating = true
  delete state.errorMessage
}

const handleFulfilled = (state: DataState, action: PayloadAction<User>) => {
  state.authenitcating = false
  state.currentUser = action.payload
  state.loading = false
}

const handleLoginRejected = (state: DataState, action: { error: { message?: string } }) => {
  state.errorMessage = action.error.message
  state.loading = false
  state.authenitcating = false
  delete state.currentUser
}

const handleLogoutPending = (state: DataState) => {
  delete state.errorMessage
  state.loading = true
}

const handleLogoutFulfilled = (state: DataState) => {
  delete state.currentUser
  delete state.errorMessage
  state.loading = false
}

const handleLogoutRejected = (state: DataState, action: { error: { message?: string } }) => {
  delete state.currentUser
  state.errorMessage = action.error.message
  state.loading = false
}

const handlePending = (state: DataState) => {
  state.modifying = true
  delete state.errorMessage
}

const handlePatchRejected = (state: DataState, action: { error: { message?: string } }) => {
  state.errorMessage = action.error.message
  state.modifying = false
}

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, handleLoginPending)
      .addCase(loginAsync.fulfilled, handleFulfilled)
      .addCase(loginAsync.rejected, handleLoginRejected)
      .addCase(logoutAsync.pending, handleLogoutPending)
      .addCase(logoutAsync.fulfilled, handleLogoutFulfilled)
      .addCase(logoutAsync.rejected, handleLogoutRejected)
      .addCase(createAsync.pending, handlePending)
      .addCase(createAsync.fulfilled, handleFulfilled)
      .addCase(createAsync.rejected, handleLoginRejected)
      .addCase(patchAsync.pending, handlePending)
      .addCase(patchAsync.fulfilled, handleFulfilled)
      .addCase(patchAsync.rejected, handlePatchRejected)
  }
})

export default usersSlice.reducer
