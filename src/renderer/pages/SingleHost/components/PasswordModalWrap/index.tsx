import PasswordModal from '../../../../components/PasswordModal';
import useAppDispatch from '../../../../hooks/useAppDispatch';
import useAppSelector from '../../../../hooks/useAppSelector';
import useGetUser from '../../../../hooks/useGetUser';
import { setSinglePassword, singleSlicePassword } from '../../singleSlice';

export default function () {
  const dispatch = useAppDispatch();
  const password = useAppSelector(singleSlicePassword);
  const user = useGetUser();
  const handlePasswordCallback = (password: string) => {
    dispatch(setSinglePassword({ password }));
  };
  return (
    <PasswordModal
      handlePasswordCallback={handlePasswordCallback}
      password={password}
      user={user}
    />
  );
}
