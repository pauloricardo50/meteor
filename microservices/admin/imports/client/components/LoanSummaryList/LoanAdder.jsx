import React from 'react';
import PropTypes from 'prop-types';

import Button from 'core/components/Button';
import Icon from 'core/components/Icon';
import LoanAdderContainer from './LoanAdderContainer';

const LoanAdder = ({ onSubmit }) => (
  <Button
    icon={<Icon type="add" />}
    primary
    raised
    label="Hypothèque"
    onClick={() => {
      const confirmed = window.confirm('Ajouter une hypothèque?');

      if (confirmed) {
        return onSubmit();
      }
    }}
    className="ml-8"
  />
);

LoanAdder.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default LoanAdderContainer(LoanAdder);
