import type { RootState } from './store'

// modal
export const selectShowModal = (modalName: string, state: RootState) => state.modal[modalName]

// theme
export const selectCurrentTheme = (state: RootState) => state.theme.currentTheme
export const selectCurrentThemeType = (state: RootState) => state.theme.currentThemeType

// toasts
export const selectToasts = (state: RootState) => state.toasts.data

// urls
export const selectUrlsData = (state: RootState) => state.urls.data
export const selectUrlData = (id: number, state: RootState) => state.urls.data.find((url) => url.id === id)
export const selectUrlDataBySlug = (slug: string, state: RootState) => state.urls.data.find((url) => url.slug === slug)
export const selectUrlsErrorMessage = (state: RootState) => state.urls.errorMessage
export const selectUrlsLimit = (state: RootState) => state.urls.limit
export const selectUrlsSearch = (state: RootState) => state.urls.search
export const selectUrlsSkip = (state: RootState) => state.urls.skip
export const selectUrlsSort = (state: RootState) => state.urls.sort
export const selectUrlsSortOrder = (state: RootState) => state.urls.sortOrder
export const selectUrlsTotal = (state: RootState) => state.urls.total
export const selectUrlsLoading = (state: RootState) => state.urls.loading
export const selectUrlsModifying = (state: RootState) => state.urls.creating || state.urls.patching || state.urls.removing

// users
export const selectCurrentUser = (state: RootState) => state.users.currentUser
export const selectUsersErrorMessage = (state: RootState) => state.users.errorMessage
export const selectUsersLoading = (state: RootState) => state.users.loading
export const selectUsersModifying = (state: RootState) => state.users.modifying
