// @flow
import React from 'react';
import connectField from 'uniforms/connectField';

import Button from 'core/components/Button';

type TaskModifierDateSetterProps = {};

const TaskModifierDateSetter = ({
  funcs,
  uniforms: { onChange },
}: TaskModifierDateSetterProps) => (
  <div>
    <label htmlFor="">Échéance rapide</label>
    <div className="space-children">
      {funcs.map(({ func, label }) => (
        <Button primary raised key={label} onClick={() => onChange(...func())}>
          {label}
        </Button>
      ))}
    </div>
  </div>
);

export default connectField(TaskModifierDateSetter);
