import React, { useState } from 'react';
import { connectField } from 'uniforms';

import Button from 'core/components/Button';

const InsuranceFormEndDateSetter = ({
  func,
  label,
  uniforms: { onChange },
  buttonProps,
  model = {},
}) => {
  const [error, setError] = useState(undefined);

  return (
    <div className="flex-col">
      <Button
        {...buttonProps}
        key={label}
        onClick={() => func({ model, setError }).map(args => onChange(...args))}
      >
        {label}
      </Button>
      {error && (
        <p
          className="error"
          style={{ position: 'absolute', top: '60px', left: '0px' }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default connectField(InsuranceFormEndDateSetter);
