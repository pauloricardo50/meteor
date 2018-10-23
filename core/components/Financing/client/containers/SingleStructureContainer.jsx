// @flow
import React from 'react';
import { Consumer } from './loan-context';

export default Component => (props) => {
  const { structureId } = props;
  return (
    <Consumer>
      {loan => (
        <Component
          {...props}
          structure={loan.structures.find(({ id }) => id === structureId)}
        />
      )}
    </Consumer>
  );
};
