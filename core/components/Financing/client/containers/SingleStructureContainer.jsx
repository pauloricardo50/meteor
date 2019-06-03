// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';
import { Consumer } from './loan-context';

export default Component =>
  React.memo((props) => {
    const { structureId } = props;
    return (
      <Consumer>
        {({ loan }) => {
          const structure = loan.structures.find(({ id }) => id === structureId);
          return (
            <Component
              {...props}
              structure={{
                ...structure,
                disableForms:
                  Meteor.microservice === 'admin' ? false : structure.disabled,
              }}
            />
          );
        }}
      </Consumer>
    );
  });
