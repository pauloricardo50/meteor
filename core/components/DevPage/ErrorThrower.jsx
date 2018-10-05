// @flow
import React from 'react';
import { withState } from 'recompose';

import Button from '../Button';

type ErrorThrowerProps = {};

const ErrorThrower = ({ fuckedUp, fuckShitUp }: ErrorThrowerProps) => (
  <div className="error-thrower">
    <Button raised error onClick={() => fuckShitUp(true)}>
      Throw render error
    </Button>
    <Button
      raised
      error
      onClick={() => {
        throw new Error('DevPage onClick error thrown');
      }}
    >
      Throw onClick error
    </Button>
    {fuckedUp
      && (() => {
        throw new Error('DevPage render error thrown');
      })()}
  </div>
);

export default withState('fuckedUp', 'fuckShitUp', false)(ErrorThrower);
