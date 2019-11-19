import React from 'react';
import PropTypes from 'prop-types';
import RadioButtons from 'core/components/RadioButtons';
import T from 'core/components/Translation';

const Widget1MonthlyMaintenance = ({ onChange, value }) => (
  <RadioButtons
    onChange={onChange}
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
  onChange: PropTypes.func.isRequired,
  value: PropTypes.bool.isRequired,
};

export default Widget1MonthlyMaintenance;
