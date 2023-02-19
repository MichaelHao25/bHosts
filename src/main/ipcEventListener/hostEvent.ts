import { ipcMain } from 'electron';
import { IAllAction, IResponseStatus } from '../../public/actions';
import {
  IHostEventGetHostResponseAction,
  IHostEventSetHostResponseAction,
  IHostsEventType,
} from '../../public/actions/IHostsEventType';
import {
  IUserEventAction,
  IUserEventGetUserNameResponseAction,
  IUserEventType,
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
          const action: IHostEventSetHostResponseAction = {
            type: IHostsEventType.setHostResponse,
            payload: {
              status: IResponseStatus.Success,
              data: 'host update success!',
            },
          };
          event.reply(ElectronChannel.HostEvent, action);
        })
        .catch((error) => {
          const action: IHostEventSetHostResponseAction = {
            type: IHostsEventType.setHostResponse,
            payload: {
              status: IResponseStatus.Error,
              message: error.message,
            },
          };
          event.reply(ElectronChannel.HostEvent, action);
        });
      break;
    }
    case IHostsEventType.getHostRequest: {
      getHost().then((host) => {
        const action: IHostEventGetHostResponseAction = {
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
        const { username } = getUserInfo();
        if (username) {
          const action: IUserEventGetUserNameResponseAction = {
            type: IUserEventType.getUserNameResponse,
            payload: {
              status: IResponseStatus.Success,
              data: username,
            },
          };
          event.reply(ElectronChannel.UserEvent, action);
        } else {
          const action: IUserEventGetUserNameResponseAction = {
            type: IUserEventType.getUserNameResponse,
            payload: {
              status: IResponseStatus.Error,
              message: 'username is null',
            },
          };

          event.reply(ElectronChannel.UserEvent, action);
        }
        break;
      }
      default: {
        console.log('ElectronChannel.UserEvent default');
      }
    }
  }
);
