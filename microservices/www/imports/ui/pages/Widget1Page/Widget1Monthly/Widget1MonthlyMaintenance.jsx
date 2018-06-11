import React from 'react';
import PropTypes from 'prop-types';
import RadioButtons from 'core/components/RadioButtons';
import T from 'core/components/Translation';

const Widget1MonthlyMaintenance = ({ onChange, value }) => (
  <RadioButtons
    onChange={(_, newValue) => onChange(newValue)}
    options={[
      { id: true, label: <T id="Widget1MonthlyMaintenance.yes" /> },
      { id: false, label: <T id="Widget1MonthlyMaintenance.no" /> },
    ]}
    value={value}
    label={<T id="Widget1MonthlyMaintenance.label" />}
    id="Widget1MonthlyMaintenance"
  />
);

Widget1MonthlyMaintenance.propTypes = {
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Widget1MonthlyMaintenance;
