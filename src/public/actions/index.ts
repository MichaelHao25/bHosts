import { IHostsEventAction, IHostsEventType } from './IHostsEventType';
import { IUserEventAction, IUserEventType } from './IUserEventType';

export interface IAction {
  type: IHostsEventType | IUserEventType;
  payload?: Record<string, any> | string | number;
}

export enum IResponseStatus {
  Error,
  Success,
}

export interface IResponseSuccess<T> {
  status: IResponseStatus.Success;
  data: T;
}

export interface IResponseError<T> {
  status: IResponseStatus.Error;
  data: T;
}

export type IResponse<T> = IResponseSuccess<T> | IResponseError<T>;

export type IAllAction = IUserEventAction | IHostsEventAction;
