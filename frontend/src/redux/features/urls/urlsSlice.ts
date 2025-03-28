import { type Action, createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Params } from '@feathersjs/feathers'

import client from '../../../lib/feathers/feathersClient'

import type { Url, UrlData, UrlPatch } from '../../../models/Url'

import { mergeData, removeData } from '../../../lib/util'

import { createToast } from '../toasts/toastsSlice'

interface UrlDataState {
  data: Array<Url>
  limit: number
  skip: number
  total: number
  creating: boolean
  loading: boolean
  patching: boolean
  removing: boolean

  errorMessage?: string
}

const initialState: UrlDataState = {
  data: [],
  limit: 10,
  skip: 0,
  total: 0,
  creating: false,
  loading: false,
  patching: false,
  removing: false
}

interface ICreateParams {
  data: UrlData
  params?: Params
}

interface IRemoveParams {
  id: string
  params?: Params
}

interface IPatchParams extends IRemoveParams {
  data: UrlPatch
}

export const findAsync = createAsyncThunk('urls/find', async (params: Params | undefined, { dispatch }): Promise<Url[]> => {
  try {
    const { data } = await client.service('urls').find(params)
    return data
  } catch (e: unknown) {
    dispatch(createToast({ type: 'error', message: `Error getting urls: ${(e as Error).message}` }))
    throw e
  }
})

export const createAsync = createAsyncThunk('urls/create', async ({ data, params }: ICreateParams, { dispatch }): Promise<Url> => {
  try {
    return await client.service('urls').create(data, params)
  } catch (e: unknown) {
    dispatch(createToast({ type: 'error', message: `Error creating url: ${(e as Error).message}` }))
    throw e
  }
})

export const patchAsync = createAsyncThunk('urls/patch', async ({ id, data, params }: IPatchParams, { dispatch }): Promise<Url> => {
  try {
    return await client.service('urls').patch(id, data, params)
  } catch (e: unknown) {
    dispatch(createToast({ type: 'error', message: `Error updating url: ${(e as Error).message}` }))
    throw e
  }
})

export const removeAsync = createAsyncThunk('urls/remove', async ({ id, params }: IRemoveParams, { dispatch }): Promise<Url> => {
  try {
    return await client.service('urls').remove(id, params)
  } catch (e: unknown) {
    dispatch(createToast({ type: 'error', message: `Error removing url: ${(e as Error).message}` }))
    throw e
  }
})

const resetLoadingState = (state: UrlDataState) => {
  state.creating = false
  state.loading = false
  state.patching = false
  state.removing = false
}

export const handleFulfilled = (state: UrlDataState, action: PayloadAction<Url | Url[]>) => {
  if (action.payload) {
    state.data = mergeData(state.data, action.payload)
  }

  resetLoadingState(state)
}

export const handleRejected = (state: UrlDataState, action: Action<string> & { error: { message?: string } }) => {
  state.errorMessage = action.error.message

  resetLoadingState(state)
}

export const handlePending = (loadingStateProperty: keyof Pick<UrlDataState, 'loading' | 'creating' | 'patching' | 'removing'>) => (state: UrlDataState) => {
  delete state.errorMessage

  state[loadingStateProperty] = true
}

export const handleRemoveFulfilled = (state: UrlDataState, action: PayloadAction<Url>) => {
  if (action.payload) {
    state.data = removeData(state.data, action.payload)
  }

  resetLoadingState(state)
}

export const urlsSlice = createSlice({
  name: 'urls',
  initialState,
  reducers: {
    dataAdded: (state, action: PayloadAction<Url | Url[]>) => {
      state.data = mergeData(state.data, action.payload)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(findAsync.pending, handlePending('loading'))
      .addCase(findAsync.fulfilled, handleFulfilled)
      .addCase(findAsync.rejected, handleRejected)
      .addCase(createAsync.pending, handlePending('creating'))
      .addCase(createAsync.fulfilled, handleFulfilled)
      .addCase(createAsync.rejected, handleRejected)
      .addCase(patchAsync.pending, handlePending('patching'))
      .addCase(patchAsync.fulfilled, handleFulfilled)
      .addCase(patchAsync.rejected, handleRejected)
      .addCase(removeAsync.pending, handlePending('removing'))
      .addCase(removeAsync.fulfilled, handleFulfilled)
      .addCase(removeAsync.rejected, handleRejected)
  }
})

export const { dataAdded } = urlsSlice.actions

export default urlsSlice.reducer
