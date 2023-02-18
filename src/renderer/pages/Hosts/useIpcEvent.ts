import { useEffect } from 'react';
import { ElectronChannel } from '../../../public/ipc';
import { IHostsEventType } from '../../../public/action';
import { message } from 'antd';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { addHostsItems, setState } from './hostsSlice';

export default () => {
  const dispatch = useAppDispatch();
  useEffect(() => {

    const removeEventListener = window.electron.ipcRenderer.on(
      ElectronChannel.HostEvent,
      (action) => {
        console.log('收到action', action);
        switch (action.type) {
          case IHostsEventType.getHost: {
            if (action.payload) {
              dispatch(addHostsItems([{
                host: action.payload
              }]));
            }
            break;
          }
          case IHostsEventType.getUserName: {
            if (action.payload) {
              dispatch(setState({
                path: ['user'],
                data: action.payload
              }));
            }
            break;
          }
          case IHostsEventType.setHost: {
            break;
          }
          case IHostsEventType.error: {
            message.error(action.payload);
            break;
          }
          case IHostsEventType.success: {
            message.success(action.payload);
            break;
          }
        }
      }
    );
    return () => {
      removeEventListener();
    };
  });
}
