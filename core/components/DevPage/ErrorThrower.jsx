// @flow
import React from 'react';
import { withState } from 'recompose';

import Button from '../Button';
import { throwDevError } from '../../api';

type ErrorThrowerProps = {};

const ErrorThrower = ({ fuckedUp, fuckShitUp }: ErrorThrowerProps) => (
  <div className="error-thrower">
    <Button raised error onClick={() => fuckShitUp(true)}>
      Throw render error
    </Button>
    <Button raised error onClick={() => throwDevError.run({})}>
      Throw server error
    </Button>
    <Button raised error onClick={() => throwDevError.run({ promise: true })}>
      Throw server error in promise
    </Button>
    <Button
      raised
      error
      onClick={() => throwDevError.run({ promiseNoReturn: true })}
    >
      Throw server error in promise and don't return
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
