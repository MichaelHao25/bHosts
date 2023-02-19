import { IAction, IResponseError, IResponseSuccess } from './index';

export enum IHostsEventType {
  getHostRequest = 'getHostRequest',
  setHostRequest = 'setHostRequest',
  getHostResponse = 'getHostResponse',
  setHostResponse = 'setHostResponse',
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

export interface IHostsEventSetHostRequestAction extends IAction {
  type: IHostsEventType.setHostRequest;
  payload: ISetHostProps;
}

export interface IHostEventSetHostResponseAction extends IAction {
  type: IHostsEventType.setHostResponse;
  payload: IResponseSuccess<string> | IResponseError;
}

export interface IHostEventGetHostRequestAction extends IAction {
  type: IHostsEventType.getHostRequest;
  payload?: string;
}

export interface IHostEventGetHostResponseAction extends IAction {
  type: IHostsEventType.getHostResponse;
  payload: IResponseSuccess<string> | IResponseError;
}

export type IHostsEventAction =
  | IHostEventGetHostResponseAction
  | IHostEventGetHostRequestAction
  | IHostEventSetHostResponseAction
  | IHostsEventSetHostRequestAction;
