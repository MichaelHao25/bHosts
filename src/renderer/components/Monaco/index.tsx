import * as monaco from 'monaco-editor';
import { useEffect, useRef } from 'react';

interface IProps {
  /**
   * 传入的值
   */
  value?: string;
  handleSave?: (value: string) => void;
}

export default function(props: IProps) {
  const { value = 'loading', handleSave } = props;
  const divRef = useRef<HTMLDivElement>(null);
  const monacoRef = useRef<monaco.editor.IStandaloneCodeEditor>();
  useEffect(() => {
    if (divRef.current) {
      monacoRef.current = monaco.editor.create(divRef.current, {
        minimap: {
          enabled: false
        },
        value,
        language: 'shell',
        automaticLayout: true,
        contextmenu: false,
        /** 控制滚动到最后一行然后下面是否有空白行 */
        scrollBeyondLastLine: false
      });
      monaco.editor.addKeybindingRules([
        {
          // disable show command center
          keybinding: monaco.KeyCode.F1,
          command: null
        }
      ]);
      monacoRef.current.addCommand(
        /** command */
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
        () => {
          if (monacoRef.current && handleSave) {
            const monacoValue = monacoRef.current.getValue();
            handleSave(monacoValue);
          }
        }
      );
    }
    return () => {
      if (monacoRef.current) {
        monacoRef.current.dispose();
      }
    };
  }, []);
  // useEffect(() => {
  //   value && monacoRef.current && monacoRef.current.setValue(value);
  // }, [value]);
  return <div style={{ width: '100%', height: '100%' }} ref={divRef} />;
}
