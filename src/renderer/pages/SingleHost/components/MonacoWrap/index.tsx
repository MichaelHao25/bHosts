import { useState } from 'react';
import Monaco from '../../../../components/Monaco';

export default function () {
  const [value, setValue] = useState<string>('loading...');
  console.log('value', value);
  return (
    <Monaco
      value={value}
      handleSave={(handleValue) => {
        setValue(`${handleValue}11`);
      }}
    />
  );
}
