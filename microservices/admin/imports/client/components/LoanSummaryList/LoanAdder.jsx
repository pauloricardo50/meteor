import React from 'react';
import PropTypes from 'prop-types';

import T from 'core/components/Translation';
import IconButton from 'core/components/IconButton';
import { DialogForm } from 'core/components/Form';
import LoanAdderContainer from './LoanAdderContainer';

const formArray = [];

const LoanAdder = ({ onSubmit }) => (
  <DialogForm
    form="loan-adder"
    onSubmit={onSubmit}
    button={<IconButton type="add" />}
    title={<T id="LoanAdder.dialogTitle" />}
    formArray={formArray}
  />
);

LoanAdder.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default LoanAdderContainer(LoanAdder);
