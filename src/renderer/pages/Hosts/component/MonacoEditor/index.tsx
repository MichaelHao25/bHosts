import React from 'react';
import * as monaco from 'monaco-editor';
import { connect } from 'react-redux';
import { ElectronChannel } from '../../../../../public/ipc';
import { IHostsEventType, ISetHostProps } from '../../../../../public/action';
import {
  addHostsItems,
  IKey,
  setState,
  updateHostsItem,
} from '../../hostsSlice';
import { IRootState } from '../../../../store/IRootState';
import { IAppDispatch } from '../../../../store/IAppDispatch';

export const getHosts = () => {
  window.electron.ipcRenderer.sendMessage(ElectronChannel.HostEvent, {
    type: IHostsEventType.getHost,
  });
};
export const setHosts = (props: ISetHostProps) => {
  const { password, host } = props;
  window.electron.ipcRenderer.sendMessage(ElectronChannel.HostEvent, {
    type: IHostsEventType.setHost,
    payload: {
      password,
      host,
    },
  });
};

interface IProps {
  activeKey: string;
  className?: string;
  password: string;
  host: string;
  dispatch: IAppDispatch;
}

interface IState {}

class MonacoEditor extends React.PureComponent<IProps, IState> {
  private monacoRef: monaco.editor.IStandaloneCodeEditor | undefined;

  private divRef: HTMLDivElement | undefined;

  constructor(props: IProps) {
    super(props);
  }

  getDivRef() {
    const { className } = this.props;
    if (className) {
      const element = document.querySelector<HTMLDivElement>(className);
      if (element) {
        this.divRef = element;
      }
    }
  }

  saveValue = (key?: IKey) => {
    if (this.monacoRef) {
      const value = this.monacoRef.getValue();
      const { updateHostsItem } = this.props;
      updateHostsItem({
        key,
        updateItem: {
          host: value,
        },
      });
    }
  };
  private props: IProps;

  initMonacoEditor() {
    const { password, addHostsItems, setState, updateHostsItem, host } =
      this.props;
    if (this.divRef) {
      this.monacoRef = monaco.editor.create(this.divRef, {
        minimap: {
          enabled: false,
        },
        value: host || 'loading...',
        language: 'shell',
        automaticLayout: true,
        contextmenu: false,
        /** 控制滚动到最后一行然后下面是否有空白行 */
        scrollBeyondLastLine: false,
      });
      monaco.editor.addKeybindingRules([
        {
          // disable show command center
          keybinding: monaco.KeyCode.F1,
          command: null,
        },
      ]);
      // this.monacoRef.onDidChangeModelContent(() => {
      //     if (this.monacoRef) {
      //         const value = this.monacoRef.getValue();
      //         updateHostsItem({
      //             updateItem: {
      //                 host: value,
      //             }
      //         })
      //     }
      // })
      this.monacoRef.addCommand(
        /** command */
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
        () => {
          if (this.monacoRef) {
            const host = this.monacoRef.getValue();
            if (host && password) {
              setHosts({
                password,
                host,
              });
              this.saveValue();
            }
            if (password === '') {
              setState({
                path: ['password'],
                data: undefined,
              });
            }
          }
        }
      );
    }
  }

  componentDidMount() {
    this.getDivRef();
    this.initMonacoEditor();
    this.props.saveValue && this.props.saveValue(this.saveValue);
  }

  componentWillUnmount() {
    if (this.monacoRef) {
      this.monacoRef?.dispose();
    }
  }

  componentDidUpdate() {
    console.log('componentDidUpdate');
    if (this.monacoRef) {
      const value = this.monacoRef.getValue();
      if (this.props.host !== value) {
        this.monacoRef.setValue(this.props.host);
      }
    }
  }

  render() {
    console.log('render');
    const { className } = this.props;
    if (className) {
      return <></>;
    }
    return (
      <div
        ref={(node) => {
          if (node) {
            this.divRef = node;
          }
        }}
        style={{ width: '100%', height: '100%' }}
      />
    );
  }
}

function mapStateToProps(state: IRootState, props: IProps) {
  const { activeKey } = props;
  let host = '';
  if (state.hosts.hosts) {
    const item = state.hosts.hosts.find((item) => item.key === activeKey);
    if (item) {
      host = item.host;
    }
  }
  return {
    password: state.hosts.password,
    host,
  };
}

function mapDispatchToProps(dispatch: IAppDispatch) {
  return {
    addHostsItems: (e) => dispatch(addHostsItems(e)),
    setState: (e) => dispatch(setState(e)),
    updateHostsItem: (e) => dispatch(updateHostsItem(e)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MonacoEditor);
// export const aa = React.memo((props: IProps) => {
//     const {activeKey, className,saveValue} = props;
//     const dispatch = useAppDispatch()
//     const monacoRef = useRef<monaco.editor.IStandaloneCodeEditor>();
//     const divElementRef = useRef<HTMLDivElement>(null);
//     const password = useAppSelector(state => state.hosts.password);
//     const host = useAppSelector(state => {
//         if (state.hosts.hosts) {
//             const item = state.hosts.hosts.find(item => item.key === activeKey);
//             if (item) {
//                 return item.host;
//             }
//         }
//         return undefined;
//     });
//
//     useEffect(() => {
//         let monacoElement: HTMLDivElement | null = null
//         if (className) {
//             const element: HTMLDivElement | null = document.querySelector(className);
//             if (element) {
//                 monacoElement = element;
//             }
//         } else {
//             monacoElement = divElementRef.current;
//         }
//         if (monacoElement) {
//             // monacoElement.removeAttribute('style');
//             monacoRef.current = monaco.editor.create(monacoElement, {
//                 minimap: {
//                     enabled: false
//                 },
//                 value: 'loading...',
//                 language: 'shell',
//                 automaticLayout: true,
//                 contextmenu: false,
//                 /** 控制滚动到最后一行然后下面是否有空白行 */
//                 scrollBeyondLastLine: false,
//             });
//             monaco.editor.addKeybindingRules([
//                 {
//                     // disable show command center
//                     keybinding: monaco.KeyCode.F1,
//                     command: null
//                 }
//             ]);
//             monacoRef.current.onDidChangeModelContent(() => {
//                 dispatch(updateHostsItem({
//                     updateItem: {
//                         host: monacoRef.current?.getValue(),
//                     }
//                 }))
//             })
//             monacoRef.current.addCommand(
//                 /** command */
//                 monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
//                 () => {
//                     if (monacoRef.current) {
//                         const host = monacoRef.current.getValue();
//                         if (host && password) {
//                             setHosts({
//                                 password, host
//                             });
//                             dispatch(updateHostsItem({
//                                 updateItem: {
//                                     host,
//                                 }
//                             }))
//                         }
//                         if (password === '') {
//                             dispatch(setState({
//                                 path: ['password'],
//                                 data: undefined,
//                             }))
//                         }
//                     }
//                 }
//             );
//
//         }
//         return () => {
//             if (monacoRef.current) {
//                 monacoRef.current.dispose();
//             }
//         };
//     }, [password, activeKey]);
//     useEffect(() => {
//         if (host) {
//             if (monacoRef.current) {
//                 monacoRef.current.setValue(host)
//             }
//         } else {
//             getHosts();
//         }
//     }, [activeKey])
//     useEffect(() => {
//         const closeHandle = window.electron.ipcRenderer.on(
//             ElectronChannel.hostEvent,
//             (action) => {
//                 switch (action.type) {
//                     case IHostsEventType.getHost: {
//                         if (action.payload && monacoRef.current) {
//                             monacoRef.current.setValue(action.payload);
//                             dispatch(addHostsItems([{
//                                 key: activeKey,
//                                 host: action.payload,
//                             }]))
//                         }
//                         break;
//                     }
//                     case IHostsEventType.getUserName: {
//                         if (action.payload) {
//                             dispatch(setState({
//                                 path: ['user'],
//                                 data: action.payload
//                             }))
//                         }
//                         break;
//                     }
//                     case IHostsEventType.setHost: {
//                         break;
//                     }
//                     case IHostsEventType.error: {
//                         message.error(action.payload);
//                         break;
//                     }
//                     case IHostsEventType.success: {
//                         message.success(action.payload);
//                         break;
//                     }
//                 }
//             }
//         );
//
//         return () => {
//             if (closeHandle) {
//                 closeHandle();
//             }
//         };
//     }, [activeKey]);
//     if (className) {
//         return null
//     } else {
//         return (
//             <div ref={divElementRef} style={{width: '100%', height: '100%'}}/>
//         );
//     }
// });
