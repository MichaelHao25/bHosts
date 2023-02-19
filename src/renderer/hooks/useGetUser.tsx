import { useEffect, useState } from 'react';
import { message } from 'antd';
import { IUserEventType } from '../../public/actions/IUserEventType';
import { ElectronChannel } from '../../public/ipc';
import { IResponseStatus } from '../../public/actions';

export default (): string => {
  const [user, setUser] = useState<string>('');
  useEffect(() => {
    window.electron.ipcRenderer.once(ElectronChannel.UserEvent, (data) => {
      console.log('useGetUser', data);
      const { type, payload } = data;
      if (type === IUserEventType.getUserNameResponse) {
        if (payload) {
          const { status } = payload;
          if (status === IResponseStatus.Success) {
            setUser(payload.data);
          } else {
            message.error(payload.message);
          }
        }
      }
    });
    window.electron.ipcRenderer.sendMessage(ElectronChannel.UserEvent, {
      type: IUserEventType.getUserNameRequest,
    });
  }, []);
  return user;
};
