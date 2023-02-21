import { useCallback, useEffect } from 'react';
import { message } from 'antd';
import Monaco, { IMonacoProps } from '../../../../components/Monaco';
import {
  setSingleHostContent,
  singleSliceHostContent,
  singleSlicePassword,
} from '../../singleSlice';
import useAppSelector from '../../../../hooks/useAppSelector';
import useAppDispatch from '../../../../hooks/useAppDispatch';
import { IResponseStatus } from '../../../../../public/actions';
import getHost from './getHost';
import { saveHost } from './saveHost';

export default function () {
  const [messageApi, contextHolder] = message.useMessage();
  const password = useAppSelector(singleSlicePassword);
  const hostContent = useAppSelector(singleSliceHostContent);
  const dispatch = useAppDispatch();
  const key = 'updatable';
  useEffect(() => {
    getHost()
      .then((payload) => {
        const { status } = payload;
        if (IResponseStatus.Success === status) {
          const { data } = payload;
          dispatch(setSingleHostContent({ hostContent: data }));
        } else {
          throw new Error(payload.message);
        }
        return '';
      })
      .catch((e) => {
        message.error(e.message || '获取host失败');
      });
  }, [dispatch]);

  const handleSave = useCallback<Required<IMonacoProps>['onSave']>(
    (value) => {
      if (password) {
        messageApi.open({
          key,
          type: 'loading',
          content: 'loading...',
          duration: 0,
        });
        saveHost({ password, host: value })
          .then((payload) => {
            const { status } = payload;
            if (IResponseStatus.Success === status) {
              messageApi.open({
                key,
                type: 'success',
                content: '保存成功!',
                duration: 2,
              });
            } else {
              throw new Error(payload.message);
            }
            return '';
          })
          .catch((e) => {
            messageApi.open({
              key,
              type: 'success',
              content: e.message || '设置host失败',
              duration: 2,
            });
          });
      }
    },
    [password]
  );
  // const onChange = useCallback<Required<IMonacoProps>['onChange']>(
  //   (value) => {
  //     dispatch(setSingleHostContent({ hostContent: value }));
  //   },
  //   [dispatch]
  // );
  return (
    <>
      {contextHolder}
      <Monaco value={hostContent} onSave={handleSave} />
    </>
  );
}
