export enum IHostsEventType {
  getHost = 'getHost',
  setHost = 'setHost',
  getUserName = 'getUserName',
  success = 'success',
  error = 'error',
}

export interface IAction {
  type: IHostsEventType;
  payload?: Record<string, any> | string | number;
}

export interface ISetHostProps {
  /**
   * 更新的host信息
   */
  host: string;
  /**
   * 管理员密码
   */
  password: string;
}

export interface ISetHostAction extends IAction {
  type: IHostsEventType.setHost;
  payload: ISetHostProps;
}

export interface IGetHostAction extends IAction {
  type: IHostsEventType.getHost;
  payload?: string;
}

export interface IErrorMessage extends IAction {
  type: IHostsEventType.error;
  payload: string;
}

export interface ISuccessMessage extends IAction {
  type: IHostsEventType.success;
  payload: string;
}

export interface IGetUserName extends IAction {
  type: IHostsEventType.getUserName;
  payload?: string;
}

export type IAllAction =
  | ISetHostAction
  | IGetHostAction
  | IErrorMessage
  | ISuccessMessage
  | IGetUserName;
