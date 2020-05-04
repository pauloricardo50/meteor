import React from 'react';
import PropTypes from 'prop-types';

import Button from 'core/components/Button';
import Icon from 'core/components/Icon';
import T from 'core/components/Translation';

import DashboardInfoTeamForm from './DashboardInfoTeamForm';

const DashboardInfoTeamAdder = ({ addContact }) => (
  <DashboardInfoTeamForm
    triggerComponent={handleOpen => (
      <Button onClick={handleOpen} raised icon={<Icon type="personAdd" />}>
        <T id="DashboardInfoTeamAdder.label" />
      </Button>
    )}
    onSubmit={addContact}
  />
);

DashboardInfoTeamAdder.propTypes = {
  addContact: PropTypes.func.isRequired,
};

export default DashboardInfoTeamAdder;
