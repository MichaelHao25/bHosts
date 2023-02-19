import { useCallback, useState } from 'react';
import { message } from 'antd';
import Monaco, { IMonacoProps } from '../../../../components/Monaco';
import { ElectronChannel } from '../../../../../public/ipc';
import { IUserEventType } from '../../../../../public/actions/IUserEventType';
import { IResponseStatus } from '../../../../../public/actions';
import {
  IHostsEventSetHostRequestAction,
  IHostsEventType,
} from '../../../../../public/actions/IHostsEventType';

const setHost = () => {
  window.electron.ipcRenderer.once(ElectronChannel.HostEvent, (data) => {
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
  const action: IHostsEventSetHostRequestAction = {
    type: IHostsEventType.setHostRequest,
    payload: {
      host: '',
      password: '',
    },
  };
  window.electron.ipcRenderer.sendMessage(ElectronChannel.HostEvent, action);
};
export default function () {
  const [value, setValue] =
    useState<Required<IMonacoProps>['value']>('loading...');
  const handleSave = useCallback<Required<IMonacoProps>['handleSave']>(
    (handleValue) => {
      setValue(`${handleValue}`);
    },
    []
  );
  return <Monaco value={value} handleSave={handleSave} />;
}
