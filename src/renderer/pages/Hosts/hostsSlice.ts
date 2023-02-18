import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TabsProps } from 'antd/es/tabs';
import { message } from 'antd';
import { IRootState } from '../../store/IRootState';

export type ITab = Required<TabsProps>['items'][number];


export type IKey = string;
interface IHost {
  host: string;
  key: IKey;
}

// Define a type for the slice state
export interface IHostsState {
  activeKey?: IKey;
  list?: ITab[];
  hosts?: IHost[];
  user?: string;
  password?: string;
}

export interface IUpdateItem<T = ITab> {
  key?: string;
  updateItem: Partial<T>;
}

export enum IElementType {
  MonacoEditor,
  Input,
}

// Define the initial state using that type
const initialState: IHostsState = {
  activeKey: 'local',
  list: [
    // {
    //     key: 'local',
    //     label: 'local',
    //     closable: false,
    //     children: IElementType.MonacoEditor
    // }
  ],
};

interface IActive {
  path: (keyof IHostsState)[];
  data: any;
}

const bHostsSlice = createSlice({
  name: 'bHosts',
  initialState,
  reducers: {
    removeHostsItems: (state, action: PayloadAction<IKey[]>) => {
      const { payload } = action;
      payload.forEach((key) => {
        if (state.hosts) {
          const index = state.hosts.findIndex((item) => item.key === key);
          if (index !== -1) {
            state.hosts.splice(index, 1);
          }
        }
      });
    },
    updateHostsItem: (state, action: PayloadAction<IUpdateItem<IHost>>) => {
      const { payload } = action;
      if (payload && state.hosts) {
        const { key = state.activeKey, updateItem } = payload;
        const findItem = state.hosts.find((item) => item.key === key);
        Object.entries(updateItem).forEach(([key, value]) => {
          // @ts-ignore
          findItem[key] = value;
        });
      }
    },

    addHostsItems: (
      state,
      action: PayloadAction<Partial<Required<IHostsState>['hosts'][number]>[]>
    ) => {
      const { payload } = action;
      if (payload) {
        payload.forEach((hostItem) => {
          if (hostItem) {
            const { key = state.activeKey, host } = hostItem;
            if (key && host) {
              if (state.hosts) {
                const index = state.hosts?.findIndex(
                  (item) => item.key === key
                );
                if (index !== -1) {
                  state.hosts[index] = { key, host };
                } else {
                  state.hosts.push({ key, host });
                }
              } else {
                state.hosts = [{ key, host }];
              }
            }
          }
        });
      }
    },
    addListItems: (state, action: PayloadAction<IHostsState['list']>) => {
      const { payload } = action;
      if (payload) {
        payload.forEach((tab) => {
          if (state.list) {
            if (!state.list.some((item) => item.key === tab.key)) {
              state.list.push(tab);
            }
          }
        });
      }
    },
    updateListItem: (state, action: PayloadAction<IUpdateItem<ITab>>) => {
      const {
        payload: { key, updateItem },
      } = action;
      if (state.list) {
        const findItem = state.list.find((item) => item.key === key);
        Object.entries(updateItem).forEach(([key, value]) => {
          // @ts-ignore
          findItem[key] = value;
        });
      }
      message.success('update success!!');
    },
    removeListItems: (state, action: PayloadAction<IKey[]>) => {
      const { payload } = action;
      if (payload) {
        payload.forEach((key) => {
          if (state.list) {
            const index = state.list.findIndex((item) => item.key === key);
            if (index !== -1) {
              if (index === 0) {
                const { label } = state.list[index];
                message.error(`${label}删除失败!`);
              } else {
                /**
                 * 如果删除的是激活的页面的话就处理
                 */
                if (key == state.activeKey) {
                  state.activeKey = state.list[index - 1].key;
                }
                if (index !== -1) {
                  state.list.splice(index, 1);
                }
              }
            }
          }
        });
      }
      message.success('remove success!!');
    },
    setState: (state, action: PayloadAction<IActive>) => {
      const {
        payload: { path, data },
      } = action;
      const pathLength = path.length - 1;
      let tempState: any = state;
      path.forEach((key, index) => {
        if (pathLength === index) {
          tempState[key] = data;
        } else if (tempState[key]) {
          tempState = tempState[key];
        } else {
          console.log('error');
          console.log(action);
          console.log(state);
        }
      });
      return state;
    },
  },
});

export const {
  setState,
  addListItems,
  removeListItems,
  updateListItem,
  removeHostsItems,
  updateHostsItem,
  addHostsItems,
} = bHostsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: IRootState) => state.hosts.activeKey;

export default bHostsSlice.reducer;
