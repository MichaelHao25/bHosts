import { useDispatch } from 'react-redux';
import { IAppDispatch } from '../store/IAppDispatch';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
const useAppDispatch: () => IAppDispatch = useDispatch;
export default useAppDispatch;
