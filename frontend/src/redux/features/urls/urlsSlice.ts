import { type Action, createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Paginated, Params } from '@feathersjs/feathers'

import client from '../../../lib/feathers/feathersClient'

import type { Url, UrlData, UrlPatch } from '../../../models/Url'

import { extractErrorMessage } from '../../../lib/errors'
import { mergeData, removeData } from '../../../lib/util'

import { createToast } from '../toasts/toastsSlice'

interface UrlDataState {
  data: Array<Url>
  limit: number
  skip: number
  sort: string
  sortOrder: number
  total: number
  creating: boolean
  loading: boolean
  patching: boolean
  removing: boolean

  errorMessage?: string
  search?: string
}

const initialState: UrlDataState = {
  data: [],
  limit: 10,
  skip: 0,
  sort: 'id',
  sortOrder: 1,
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
  id: number
  params?: Params
}

interface IPatchParams extends IRemoveParams {
  data: UrlPatch
}

interface IFindParams {
  id?: number
  search?: string
  limit?: number
  skip?: number
  slug?: string
  sort?: string
  sortOrder?: number
}

export const findAsync = createAsyncThunk(
  'urls/find',
  async (
    { id, limit, search, skip, slug, sort, sortOrder }: IFindParams,
    { dispatch }
  ): Promise<Paginated<Url> & { search?: string; sort?: string; sortOrder?: number }> => {
    try {
      const query: Params['query'] = {}

      if (id) {
        query.id = id
      }

      if (limit) {
        query.$limit = limit
      }

      if (skip) {
        query.$skip = skip
      }

      if (search) {
        query.$or = [{ value: { $ilike: `%${search}%` } }, { slug: { $ilike: `%${search}%` } }]
      }

      if (slug) {
        query.slug = slug
      }

      if (sort) {
        query['$sort'] = { [sort]: sortOrder }
      }

      const result = await client.service('urls').find({ query })

      return { ...result, search, sort, sortOrder }
    } catch (error: unknown) {
      dispatch(createToast({ type: 'error', message: `Error getting urls: ${extractErrorMessage(error)}` }))
      throw error
    }
  }
)

export const createAsync = createAsyncThunk('urls/create', async ({ data, params }: ICreateParams, { dispatch }): Promise<Url> => {
  try {
    const result = await client.service('urls').create(data, params)
    dispatch(createToast({ type: 'success', message: `URL "${result.value}" created successfully` }))
    return result
  } catch (error: unknown) {
    dispatch(createToast({ type: 'error', message: `Error creating url: ${extractErrorMessage(error)}` }))
    throw error
  }
})

export const patchAsync = createAsyncThunk('urls/patch', async ({ id, data, params }: IPatchParams, { dispatch }): Promise<Url> => {
  try {
    const result = await client.service('urls').patch(id, data, params)
    dispatch(createToast({ type: 'success', message: `URL "${result.value}" updated successfully` }))
    return result
  } catch (error: unknown) {
    dispatch(createToast({ type: 'error', message: `Error updating url: ${extractErrorMessage(error)}` }))
    throw error
  }
})

export const removeAsync = createAsyncThunk('urls/remove', async ({ id, params }: IRemoveParams, { dispatch }): Promise<Url> => {
  try {
    const result = await client.service('urls').remove(id, params)
    dispatch(createToast({ type: 'success', message: `URL "${result.value}" removed successfully` }))
    return result
  } catch (error: unknown) {
    dispatch(createToast({ type: 'error', message: `Error removing url: ${extractErrorMessage(error)}` }))
    throw error
  }
})

const resetLoadingState = (state: UrlDataState) => {
  state.creating = false
  state.loading = false
  state.patching = false
  state.removing = false
}

const handleFulfilled = (state: UrlDataState, action: PayloadAction<Url | Url[]>) => {
  if (action.payload) {
    state.data = mergeData(state.data, action.payload)
  }

  resetLoadingState(state)
}

const handleFindFulfilled = (state: UrlDataState, action: PayloadAction<Paginated<Url> & { search?: string; sort?: string; sortOrder?: number }>) => {
  state.data = action.payload.data
  state.limit = action.payload.limit
  state.skip = action.payload.skip
  state.total = action.payload.total

  if (action.payload.search) {
    state.search = action.payload.search
  } else {
    delete state.search
  }

  if (action.payload.sort) {
    state.sort = action.payload.sort
  }

  if (action.payload.sortOrder) {
    state.sortOrder = action.payload.sortOrder
  }

  resetLoadingState(state)
}

const handleRejected = (state: UrlDataState, action: Action<string> & { error: { message?: string } }) => {
  state.errorMessage = action.error.message

  resetLoadingState(state)
}

const handlePending = (loadingStateProperty: keyof Pick<UrlDataState, 'loading' | 'creating' | 'patching' | 'removing'>) => (state: UrlDataState) => {
  delete state.errorMessage

  if (loadingStateProperty === 'loading') {
    state.data = []
  }

  state[loadingStateProperty] = true
}

const handleRemoveFulfilled = (state: UrlDataState, action: PayloadAction<Url>) => {
  if (action.payload) {
    state.data = removeData(state.data, action.payload)
  }

  state.total -= 1

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
      .addCase(findAsync.fulfilled, handleFindFulfilled)
      .addCase(findAsync.rejected, handleRejected)
      .addCase(createAsync.pending, handlePending('creating'))
      .addCase(createAsync.fulfilled, handleFulfilled)
      .addCase(createAsync.rejected, handleRejected)
      .addCase(patchAsync.pending, handlePending('patching'))
      .addCase(patchAsync.fulfilled, handleFulfilled)
      .addCase(patchAsync.rejected, handleRejected)
      .addCase(removeAsync.pending, handlePending('removing'))
      .addCase(removeAsync.fulfilled, handleRemoveFulfilled)
      .addCase(removeAsync.rejected, handleRejected)
  }
})

export const { dataAdded } = urlsSlice.actions

export default urlsSlice.reducer
