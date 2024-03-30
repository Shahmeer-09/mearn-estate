import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from '@reduxjs/toolkit'
import persistStore from 'redux-persist/es/persistStore'
import  userReducer from './user/userSlice'
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
const rootReducer = combineReducers({user: userReducer})
const persistConfig ={
  key :'root',
  storage, 
  version: '1',
}
const persistedReducer = persistReducer(persistConfig, rootReducer)
export const store = configureStore({
  reducer: persistedReducer,
  middleware : (GetDefaultMiddleware) => GetDefaultMiddleware({
    serializableCheck : false,
  })
})

export const persistor = persistStore(store)