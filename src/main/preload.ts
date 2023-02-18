import electron, { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import { ElectronChannel } from "../public/ipc";
import { IAllAction } from "../public/actions";

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    sendMessage(channel: ElectronChannel, action: IAllAction) {
      ipcRenderer.send(channel, action);
    },
    on(channel: ElectronChannel, func: (action: IAllAction) => void) {
      const subscription = (_event: IpcRendererEvent, action: IAllAction) =>
        func(action);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: ElectronChannel, func: (action: IAllAction) => void) {
      ipcRenderer.once(channel, (_event, action) => func(action));
    }
  }
});
