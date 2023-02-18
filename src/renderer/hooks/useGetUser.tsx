import { useEffect, useState } from 'react';
import { IUserEventType } from '../../public/actions/IUserEventType';
import { ElectronChannel } from '../../public/ipc';

export default (): string => {
  const [user, setUser] = useState<string>('');
  useEffect(() => {
    window.electron.ipcRenderer.once(ElectronChannel.UserEvent, (data) => {
      const { type, payload } = data;
      if (type === IUserEventType.getUserNameRequest) {
        if (payload) {
          setUser(payload);
        } else {
          console.log('用户信息获取失败...');
        }
      }
    });
    window.electron.ipcRenderer.sendMessage(ElectronChannel.UserEvent, {
      type: IUserEventType.getUserNameRequest,
    });
  }, []);
  return user;
};
