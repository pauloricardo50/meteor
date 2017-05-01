import React, { PropTypes } from 'react';
import cleanMethod from '/imports/api/cleanMethods';

import RaisedButton from 'material-ui/RaisedButton';

const addVerifyingRequest = () => {
  const object = {
    general: { fortuneUsed: 250000, partnersToAvoid: ['joe', 'john'] },
    borrowers: 'testBorrower',
    property: { value: 1000000 },
    logic: {
      verification: {
        requested: true,
      },
    },
    admin: {},
  };
  cleanMethod('insertRequest', object);
};

const AdminDev = props => {
  return (
    <section>
      <h1>Ajouter des tests</h1>
      <div>
        <RaisedButton label="En demande de vérification" onTouchTap={() => addVerifyingRequest()} />
      </div>
    </section>
  );
};

AdminDev.propTypes = {};

export default AdminDev;
