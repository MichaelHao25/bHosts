import { ipcMain } from 'electron';
import { IAllAction, IResponseStatus } from '../../public/actions';
import {
  IGetHostResponseAction,
  IHostsEventType,
  ISetHostResponseAction,
} from '../../public/actions/IHostsEventType';
import IUserEventType, {
  IUserEventAction,
} from '../../public/actions/IUserEventType';
import { ElectronChannel } from '../../public/ipc';
import { getUserInfo } from '../util';
import { getHost, setHost } from '../utils';

ipcMain.on(ElectronChannel.HostEvent, async (event, action: IAllAction) => {
  const { type, payload } = action;

  switch (type) {
    case IHostsEventType.setHostRequest: {
      const { password, host } = payload;
      setHost({ password, host })
        .then(() => {
          const action: ISetHostResponseAction = {
            type: IHostsEventType.setHostResponse,
            payload: {
              status: IResponseStatus.Success,
              data: 'host update success!',
            },
          };
          event.reply(ElectronChannel.HostEvent, action);
        })
        .catch((error) => {
          const action: ISetHostResponseAction = {
            type: IHostsEventType.setHostResponse,
            payload: {
              status: IResponseStatus.Error,
              data: error.message,
            },
          };
          event.reply(ElectronChannel.HostEvent, action);
        });
      break;
    }
    case IHostsEventType.getHostRequest: {
      getHost().then((host) => {
        const action: IGetHostResponseAction<string> = {
          type: IHostsEventType.getHostResponse,
          payload: {
            status: IResponseStatus.Success,
            data: host,
          },
        };
        event.reply(ElectronChannel.HostEvent, action);
      });
      break;
    }
  }
});

ipcMain.on(
  ElectronChannel.UserEvent,
  async (event, action: IUserEventAction) => {
    const { type } = action;
    switch (type) {
      case IUserEventType.getUserNameRequest: {
        event.reply(ElectronChannel.UserEvent, {
          type: IUserEventType.getUserNameRequest,
          payload: getUserInfo().username,
        });
        break;
      }
      default: {
        console.log('ElectronChannel.UserEvent default');
      }
    }
  }
);
