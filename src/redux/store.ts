import { configureStore } from '@reduxjs/toolkit'
import testDataReducer from './features/testSlice'
import { crimeApi } from './api'
// ...

export const store = configureStore({
  reducer: {
    testData: testDataReducer,
    [crimeApi.reducerPath]: crimeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(crimeApi.middleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
