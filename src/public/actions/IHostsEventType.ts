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

export interface ISetHostRequestAction extends IAction {
  type: IHostsEventType.setHostRequest;
  payload: ISetHostProps;
}

export interface ISetHostResponseAction extends IAction {
  type: IHostsEventType.setHostResponse;
  payload: IResponseSuccess<string> | IResponseError<string>;
}

export interface IGetHostRequestAction extends IAction {
  type: IHostsEventType.getHostRequest;
  payload?: string;
}

export interface IGetHostResponseAction extends IAction {
  type: IHostsEventType.getHostResponse;
  payload: IResponseSuccess<string> | IResponseError<string>;
}

export type IHostsEventAction =
  | IGetHostResponseAction
  | IGetHostRequestAction
  | ISetHostResponseAction
  | ISetHostRequestAction;
