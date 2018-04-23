import React from 'react';
import PropTypes from 'prop-types';

import Select from 'core/components/Select';
import { T } from 'core/components/Translation';

const options = [
  { id: 0.01, label: 'Libor moyen, 1.00%' },
  { id: 0.012, label: '5 ans moyen, 1.20%' },
  { id: 0.015, label: '10 ans moyen, 1.50%' },
];

const Widget1MonthlyInterests = ({ value, onChange }) => (
  <div className="card-bottom">
    <Select
      label={<T id="Widget1MonthlyInterests.label" />}
      value={value}
      onChange={(_, val) => onChange(val)}
      options={options}
    />
  </div>
);

Widget1MonthlyInterests.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Widget1MonthlyInterests;
