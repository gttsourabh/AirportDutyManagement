import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer, createTransform} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from 'redux';
import authReducer from './slices/authSlice';
import dutyReducer from './slices/dutySlice';
import officerReducer from './slices/officerSlice';
import reportReducer from './slices/reportSlice';
import airportReducer from './slices/airportSlice';

// Strip volatile fields from auth before saving to storage
const authTransform = createTransform(
  (inboundState) => ({
    ...inboundState,
    error: null,
    isLoading: false,
    otpPending: null,
  }),
  (outboundState) => outboundState,
  {whitelist: ['auth']},
);

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'],
  transforms: [authTransform],
};

const rootReducer = combineReducers({
  auth: authReducer,
  duties: dutyReducer,
  officers: officerReducer,
  reports: reportReducer,
  airports: airportReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false}),
});

export const persistor = persistStore(store);
