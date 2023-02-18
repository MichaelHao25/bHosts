import { Input, message, Modal } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import React, { useState } from 'react';

interface IProps {
  password?: string;
  user?: string;
  handlePasswordCallback?: (password: string) => void;
}

export default React.memo((props: IProps) => {
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
  return (
    <Modal
      width={400}
      open={password === undefined}
      title={`Please enter user(${user}) password`}
      okText='ok'
      cancelText='cancel'
      onCancel={() => {
        message.error('Please enter password');
      }}
      onOk={handleOnOk}
    >
      <Input.Password
        value={inputPassword}
        onChange={(e) => setInputPassword(e.target.value)}
        onPressEnter={handleOnOk}
        iconRender={(visible) =>
          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
        }
      />
    </Modal>
  );
});
