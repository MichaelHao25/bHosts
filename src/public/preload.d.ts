import { ElectronChannel, WindowElectronApi } from './ipc';
import { IAllAction } from './actions';

type Func = (args: IAllAction) => void;

declare global {
  interface IElectionApi {
    ipcRenderer: {
      /**
       * 向主线程发送消息
       * @param channel 线路
       * @param action
       *
       */
      sendMessage(channel: ElectronChannel, action: IAllAction): void;
      /**
       * 监听线路
       * @param channel 线路
       * @param func 回掉函数参数是发送消息携带的函数
       *
       * @return 取消监听的方法/监听失败
       */
      on(channel: ElectronChannel, func: Func): () => undefined;
      /**
       * 监听线路一次
       * @param channel 线路
       * @param func 回掉函数参数是发送消息携带的函数
       *
       * @return boolean 监听成功/失败
       */

      once(channel: ElectronChannel, func: Func): void;
    };
  }

  interface Window {
    [WindowElectronApi]: IElectionApi;
  }
}
