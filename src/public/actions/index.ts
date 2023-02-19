import { IHostsEventAction, IHostsEventType } from './IHostsEventType';
import { IUserEventAction, IUserEventType } from './IUserEventType';

export enum IResponseStatus {
  Error,
  Success,
}

export interface IResponseSuccess<T = any> {
  status: IResponseStatus.Success;
  data: T;
}

export interface IResponseError {
  status: IResponseStatus.Error;
  message: string;
}

export interface IAction {
  type: IHostsEventType | IUserEventType;
  payload?: any;
}

export type IAllAction = IUserEventAction | IHostsEventAction;
