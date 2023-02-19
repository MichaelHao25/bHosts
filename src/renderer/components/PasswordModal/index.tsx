import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Input, message, Modal } from 'antd';
import React, { useState } from 'react';
import { PasswordProps } from 'antd/es/input/Password';

interface IPasswordModalProps {
  password?: string;
  user?: string;
  handlePasswordCallback?: (password: string) => void;
}

export default React.memo((props: IPasswordModalProps) => {
  const { password, user, handlePasswordCallback } = props;
  const [inputPassword, setInputPassword] = useState<string>('');

  const handleOnOk = () => {
    if (!inputPassword) {
      message.error('Please enter password');
    }
    if (handlePasswordCallback) {
      handlePasswordCallback(inputPassword);
    }
  };
  const iconRender: Required<PasswordProps>['iconRender'] = (visible) =>
    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />;
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPassword(e.target.value);
  };
  return (
    <Modal
      width={400}
      open={password === undefined}
      title={`Please enter user(${user}) password`}
      okText="ok"
      cancelText="cancel"
      onCancel={() => {
        message.error('Please enter password');
      }}
      onOk={handleOnOk}
    >
      <Input.Password
        value={inputPassword}
        onChange={onChange}
        onPressEnter={handleOnOk}
        iconRender={iconRender}
      />
    </Modal>
  );
});
