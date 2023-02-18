import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { IRootState } from '../store/IRootState';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector;
export default useAppSelector;
