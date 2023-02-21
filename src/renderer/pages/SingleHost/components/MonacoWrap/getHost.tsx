import {
  IHostEventGetHostRequestAction,
  IHostEventGetHostResponseAction,
  IHostsEventType,
} from '../../../../../public/actions/IHostsEventType';
import { ElectronChannel } from '../../../../../public/ipc';

/**
 * 这里理想情况下catch应该是抛出来错误的,但是现在无法抛出
 */
export default (): Promise<IHostEventGetHostResponseAction['payload']> => {
  return new Promise((resolve, reject) => {
    const { once, sendMessage } = window.electron.ipcRenderer;
    once(ElectronChannel.HostEvent, (data) => {
      const { type, payload } = data;
      if (type === IHostsEventType.getHostResponse) {
        if (payload) {
          resolve(payload);
        }
      }
    });
    const action: IHostEventGetHostRequestAction = {
      type: IHostsEventType.getHostRequest,
    };
    sendMessage(ElectronChannel.HostEvent, action);
  });
};
