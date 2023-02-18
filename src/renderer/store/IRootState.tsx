// Infer the `RootState` and `AppDispatch` types from the store itself
import { store } from './index';

export type IRootState = ReturnType<typeof store.getState>;
