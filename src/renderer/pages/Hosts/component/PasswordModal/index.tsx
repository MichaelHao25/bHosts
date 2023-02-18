import { Input, InputRef, message, Modal } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import React, { useEffect, useRef } from 'react';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { setState } from '../../hostsSlice';
import { ElectronChannel } from '../../../../../public/ipc';
import { IHostsEventType } from '../../../../../public/action';

export default React.memo(() => {
  const password = useAppSelector((state) => state.hosts.password);
  const user = useAppSelector((state) => state.hosts.user);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!user) {
      window.electron.ipcRenderer.sendMessage(ElectronChannel.HostEvent, {
        type: IHostsEventType.getUserName,
      });
    }
  }, [user]);
  const inputPassword = useRef<InputRef>(null);
  const handleOnCancel = () => {
    dispatch(
      setState({
        path: ['password'],
        data: '',
      })
    );
  };
  const handleOnOk = () => {
    if (inputPassword.current) {
      const value = inputPassword.current.input?.value;
      if (value) {
        dispatch(
          setState({
            path: ['password'],
            data: value,
          })
        );
      } else {
        message.error('Password cannot be empty');
      }
    }
  };
  return (
    <Modal
      width={400}
      open={password === undefined}
      title={`Please enter user(${user}) password`}
      okText="ok"
      cancelText="cancel"
      onCancel={handleOnCancel}
      onOk={handleOnOk}
    >
      <Input.Password
        ref={inputPassword}
        onPressEnter={handleOnOk}
        iconRender={(visible) =>
          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
        }
      />
    </Modal>
  );
});
