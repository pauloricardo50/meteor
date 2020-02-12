import React from 'react';
import { withState } from 'recompose';

import Button from '../Button';
import { throwDevError } from '../../api';

const ErrorThrower = ({ fuckedUp, fuckShitUp }) => (
  <div className="error-thrower">
    <span>Client</span>
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
    <Button
      raised
      error
      onClick={() =>
        new Promise(() => {
          throw new Error('Promise error!');
        })
      }
    >
      Throw error in promise
    </Button>
    <span>Server</span>
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
    {fuckedUp &&
      (() => {
        throw new Error('DevPage render error thrown');
      })()}
  </div>
);

export default withState('fuckedUp', 'fuckShitUp', false)(ErrorThrower);
