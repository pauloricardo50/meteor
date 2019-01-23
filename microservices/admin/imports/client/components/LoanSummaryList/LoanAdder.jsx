import React from 'react';
import PropTypes from 'prop-types';

import IconButton from 'core/components/IconButton';
import LoanAdderContainer from './LoanAdderContainer';

const LoanAdder = ({ onSubmit }) => (
  <IconButton
    type="add"
    onClick={() => {
      const confirmed = window.confirm('Ajouter une hypothèque?');

      if (confirmed) {
        return onSubmit();
      }
    }}
  />
);

LoanAdder.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default LoanAdderContainer(LoanAdder);
