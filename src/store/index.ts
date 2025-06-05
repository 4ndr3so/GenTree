// src/store/index.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import personReducer from './personSlice';
import  selectedPersonReducer  from './selectedSlice';


const loggerMiddleware = (storeAPI: any) => (next: any) => (action: any) => {
  //console.log('Dispatching:', action.type, action.payload);
  const result = next(action);
  //console.log('Next state:', storeAPI.getState());
  return result;
};

const rootReducer = combineReducers({
  person: personReducer,
  selectedPerson: selectedPersonReducer, 
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loggerMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;