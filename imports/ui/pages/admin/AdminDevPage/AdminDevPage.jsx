import React from 'react';
import PropTypes from 'prop-types';
import cleanMethod from '/imports/api/cleanMethods';

import Button from '/imports/ui/components/general/Button';

const addVerifyingRequest = () => {
  const object = {
    general: { fortuneUsed: 250000, partnersToAvoid: ['joe', 'john'] },
    borrowers: 'testBorrower',
    property: { value: 1000000 },
    logic: {
      verification: {
        requested: true,
        requestedTime: new Date(),
      },
    },
    admin: {},
  };
  cleanMethod('insertRequest', object);
};

const AdminDev = props => (
  <section>
    <h1>Ajouter des tests</h1>
    <div>
      <Button
        raised
        label="En demande de vérification"
        onClick={() => addVerifyingRequest()}
      />
    </div>
  </section>
);

AdminDev.propTypes = {};

export default AdminDev;
