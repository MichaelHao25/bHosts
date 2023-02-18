import Monaco from '../../../../components/Monaco';
import { useState } from 'react';

export default function() {
  const [value, setValue] = useState<string>('loading...');
  console.log('value', value);
  return <Monaco
    value={value}
    handleSave={value => {
      console.log(value);
      setValue(value + '11');
    }}
  />;
}
