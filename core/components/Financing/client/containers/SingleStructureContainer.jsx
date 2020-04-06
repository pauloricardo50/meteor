import { Meteor } from 'meteor/meteor';

import React from 'react';

import { Consumer } from './loan-context';

export default Component => props => {
  const { structureId } = props;
  return (
    <Consumer>
      {({ loan }) => {
        const structure = loan.structures.find(({ id }) => id === structureId);
        structure.disableForms =
          Meteor.microservice === 'admin' ? false : structure.disabled;
        return <Component {...props} structure={structure} />;
      }}
    </Consumer>
  );
};
