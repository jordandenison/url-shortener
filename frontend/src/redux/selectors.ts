import type { RootState } from './store'

// modal
export const selectShowModal = (modalName: string, state: RootState) => state.modal[modalName]

// toasts
export const selectToasts = (state: RootState) => state.toasts.data

// urls
export const selectUrlsData = (state: RootState) => state.urls.data
export const selectUrlsErrorMessage = (state: RootState) => state.urls.errorMessage
export const selectUrlsLimit = (state: RootState) => state.urls.limit
export const selectUrlsSkip = (state: RootState) => state.urls.skip
export const selectUrlsTotal = (state: RootState) => state.urls.total
export const selectUrlsLoading = (state: RootState) => state.urls.loading
export const selectUrlsModifying = (state: RootState) => state.urls.creating || state.urls.patching || state.urls.removing

// users
export const selectCurrentUser = (state: RootState) => state.users.currentUser
export const selectUsersErrorMessage = (state: RootState) => state.users.errorMessage
export const selectUsersLoading = (state: RootState) => state.users.loading
export const selectUsersModifying = (state: RootState) => state.users.modifying
