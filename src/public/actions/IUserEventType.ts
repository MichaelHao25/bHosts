import { IAction } from './index';

export enum IUserEventType {
  getUserNameRequest = 'getUserNameRequest',
}

export interface IUserEventGetUserNameRequestAction extends IAction {
  type: IUserEventType.getUserNameRequest;
  payload?: string;
}

export type IUserEventAction = IUserEventGetUserNameRequestAction;
