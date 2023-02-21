import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import singleSlice from '../pages/SingleHost/singleSlice';
import { IRootState } from './IRootState';
import { isDebug } from '../../public/isDebug';

// convert object to string and store in localStorage
function saveToLocalStorage(state: IRootState) {
  try {
    const serialisedState = JSON.stringify(state);
    localStorage.setItem('persistantState', serialisedState);
  } catch (e) {
    console.warn(e);
  }
}

// load string from localStorage and convert into an Object
// invalid output must be undefined
function loadFromLocalStorage() {
  try {
    const serialisedState = localStorage.getItem('persistantState');
    if (serialisedState === null) return undefined;
    return JSON.parse(serialisedState);
  } catch (e) {
    console.warn(e);
    return undefined;
  }
}

export const store = configureStore({
  reducer: {
    // hosts: hostsSlice,
    single: singleSlice,
  },
  preloadedState: loadFromLocalStorage(),
  middleware: isDebug ? [logger] : [],
});

store.subscribe(() => {
  saveToLocalStorage(store.getState());
});
