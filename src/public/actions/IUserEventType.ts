import { IAction, IResponseError, IResponseSuccess } from './index';

export enum IUserEventType {
  getUserNameRequest = 'getUserNameRequest',
  getUserNameResponse = 'getUserNameResponse',
}

export interface IUserEventGetUserNameRequestAction extends IAction {
  type: IUserEventType.getUserNameRequest;
  payload?: string;
}

export interface IUserEventGetUserNameResponseAction extends IAction {
  type: IUserEventType.getUserNameResponse;
  payload?: IResponseSuccess<string> | IResponseError;
}

export type IUserEventAction =
  | IUserEventGetUserNameRequestAction
  | IUserEventGetUserNameResponseAction;
