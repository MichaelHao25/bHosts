import {
  IHostEventSetHostResponseAction,
  IHostsEventSetHostRequestAction,
  IHostsEventType,
  ISetHostProps,
} from '../../../../../public/actions/IHostsEventType';
import { ElectronChannel } from '../../../../../public/ipc';

export const saveHost: (
  props: ISetHostProps
) => Promise<IHostEventSetHostResponseAction['payload']> = (props) => {
  return new Promise((resolve) => {
    const { password, host } = props;
    const { once, sendMessage } = window.electron.ipcRenderer;
    once(ElectronChannel.HostEvent, (data) => {
      console.log('useGetUser', data);
      const { type, payload } = data;
      if (type === IHostsEventType.setHostResponse) {
        if (payload) {
          resolve(payload);
        }
      }
    });
    const action: IHostsEventSetHostRequestAction = {
      type: IHostsEventType.setHostRequest,
      payload: {
        host,
        password,
      },
    };
    sendMessage(ElectronChannel.HostEvent, action);
  });
};
