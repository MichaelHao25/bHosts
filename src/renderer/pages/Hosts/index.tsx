import { Input, Tabs } from 'antd';
import React, { ReactEventHandler, useEffect } from 'react';
import { TabsProps } from 'antd/es/tabs';
import styles from './index.module.scss';
import MonacoEditor, { getHosts } from './component/MonacoEditor';
import {
  addListItems,
  IElementType,
  IHostsState,
  removeHostsItems,
  removeListItems,
  setState,
  updateListItem,
} from './hostsSlice';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import PasswordModal from './component/PasswordModal';
import useIpcEvent from './useIpcEvent';

const EditKey = 'Input';

export default function () {
  // const { innerWidth, innerHeight } = useResize();
  // console.log(innerWidth, innerHeight);
  useIpcEvent();
  const monacoSave = React.useRef<() => void>();
  const { activeKey = '', list = [] } = useAppSelector((state) => {
    return {
      activeKey: state.hosts.activeKey,
      list: state.hosts.list,
    };
  });
  const dispatch = useAppDispatch();
  useEffect(() => {
    new Promise((resolve) => {
      setActiveKey('local');
      dispatch(
        addListItems([
          {
            key: 'local',
            label: 'local',
            children: IElementType.MonacoEditor,
            closable: false,
          },
        ])
      );
      resolve('ok');
    }).then((res) => {
      if (res === 'ok') {
        getHosts();
      }
    });
  }, []);
  const setActiveKey = (activeKey: IHostsState['activeKey']) => {
    dispatch(
      setState({
        path: ['activeKey'],
        data: activeKey,
      })
    );
  };
  const handleOnEdit: TabsProps['onEdit'] = (key, action) => {
    switch (action) {
      case 'add': {
        dispatch(
          addListItems([
            {
              key: EditKey,
              label: '',
              children: IElementType.Input,
              closable: true,
            },
          ])
        );
        break;
      }
      case 'remove': {
        if (typeof key === 'string') {
          dispatch(removeHostsItems([key]));
          dispatch(removeListItems([key]));
        }
        break;
      }
      default: {
        console.log('nocase');
      }
    }
  };
  const handleSaveEdit: ReactEventHandler<HTMLInputElement> = (event) => {
    // @ts-ignore
    const label = event.target.value;
    const newKey = `_${new Date().getTime()}`;
    if (label) {
      new Promise((resolve) => {
        dispatch(
          updateListItem({
            key: EditKey,
            updateItem: {
              key: newKey,
              label,
              children: IElementType.MonacoEditor,
            },
          })
        );
        setActiveKey(newKey);
        resolve('ok');
      }).then((res) => {
        if (res === 'ok') {
          getHosts();
        }
      });
      // setList(list => {
      //     return produce(list, (draft) => {
      //       if (draft) {
      //         draft.find(item => {
      //           if (item.key === EditKey) {
      //             item.key = `_${new Date().getTime()}`;
      //             item.label = label;
      //             item.children = IElementType.MonacoEditor;
      //             setActiveKey(item.key);
      //           }
      //         });
      //       }
      //     });
      //   }
      // );
    } else {
      handleOnEdit(EditKey, 'remove');
    }
  };
  const saveValue = React.useCallback((func: () => void) => {
    monacoSave.current = func;
  }, []);
  if (list === undefined) {
    return <></>;
  }
  return (
    <>
      <Tabs
        // key={`key_${innerWidth}_${innerHeight}`}
        className={styles.tabs}
        type="editable-card"
        tabPosition="left"
        activeKey={activeKey}
        onTabClick={(activeKey) => {
          if (activeKey !== EditKey) {
            monacoSave.current && monacoSave.current();
            setActiveKey(activeKey);
          }
        }}
        // @ts-ignore
        items={list.map((item) => {
          switch (item.children) {
            case IElementType.Input: {
              return {
                ...item,
                label: (
                  <Input
                    autoFocus
                    onBlur={handleSaveEdit}
                    onPressEnter={handleSaveEdit}
                    onKeyDown={(event) => {
                      if (event.code === 'Escape') {
                        handleOnEdit(EditKey, 'remove');
                      }
                    }}
                  />
                ),
                children: null,
              };
              break;
            }
            case IElementType.MonacoEditor: {
              return {
                ...item,
                children: null,
              };
              break;
            }
          }
        })}
        onEdit={handleOnEdit}
      />
      <MonacoEditor
        className={`.${styles.tabs} .ant-tabs-content-holder`}
        saveValue={saveValue}
        activeKey={activeKey}
      />
      <PasswordModal />
    </>
  );
}

// items={'1'.repeat(10).split('').map((item, index) => {
//   if (index === 0) {
//     return {
//       key: index.toString(),
//       label: index.toString(),
//       children: <MonacoEditor/>,
//       closable: false
//     };
//   } else if (index === 1) {
//     return {
//       key: index.toString(),
//       label: <Input autoFocus />,
//       children: ''
//     };
//   } else {
//     return {
//       key: index.toString(),
//       label: index.toString(),
//       children: index.toString()
//     };
//   }
// })
// }

// export default () => {
//   return <div className={styles.Hosts}>
//     <aside className={styles.aside}></aside>
//     <main className={styles.main}>
//       <Tabs type={'editable-card'} tabPosition={'left'}
//             items={'1'.repeat(100).split('').map((item, index) => {
//               return {
//                 key: index.toString(),
//                 label: index.toString(),
//                 children: index.toString()
//               };
//             })
//             }
//       ></Tabs>
//     </main>
//   </div>;
// };
