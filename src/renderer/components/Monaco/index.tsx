import * as monaco from 'monaco-editor';
import React, { useEffect, useRef } from 'react';

export interface IMonacoProps {
  /**
   * 传入的值
   */
  value?: string;
  onSave?: (value: string) => void;
  onChange?: (value: string) => void;
}

export default React.memo(function (props: IMonacoProps) {
  const { value, onSave, onChange } = props;
  const divRef = useRef<HTMLDivElement>(null);
  const monacoRef = useRef<monaco.editor.IStandaloneCodeEditor>();
  useEffect(() => {
    if (divRef.current) {
      monacoRef.current = monaco.editor.create(divRef.current, {
        minimap: {
          enabled: false,
        },
        value: 'loading...',
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
    }
    return () => {
      if (monacoRef.current) {
        monacoRef.current.dispose();
      }
    };
  }, []);
  useEffect(() => {
    monacoRef.current?.onDidChangeModelContent(() => {
      if (monacoRef.current && onChange) {
        const monacoValue = monacoRef.current.getValue();
        onChange(monacoValue);
      }
    });
  }, [onChange]);
  useEffect(() => {
    monacoRef.current?.addCommand(
      /** command */
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      () => {
        if (monacoRef.current && onSave) {
          const monacoValue = monacoRef.current.getValue();
          onSave(monacoValue);
        }
      }
    );
  }, [onSave]);
  useEffect(() => {
    if (value && monacoRef.current) {
      const position = monacoRef.current.getPosition();
      monacoRef.current.setValue(value);
      if (position) {
        monacoRef.current.setPosition(position);
      }
    }
  }, [value]);
  return <div style={{ width: '100%', height: '100%' }} ref={divRef} />;
});
