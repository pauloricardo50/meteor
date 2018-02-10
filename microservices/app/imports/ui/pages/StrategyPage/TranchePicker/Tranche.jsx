import React from 'react';
import PropTypes from 'prop-types';

import { T } from 'core/components/Translation';
import Select from 'core/components/Select';
import TextInput from 'core/components/TextInput';
import IconButton from 'core/components/IconButton';

const Tranche = ({ tranche, changeTranche, deleteTranche, options }) => (
  <div className="flex" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
    <T id="Tranche.tranche" />
    <Select
      label=""
      value={tranche.type}
      onChange={(id, type) => changeTranche(tranche.type, 'type', type)}
      options={options.map(option => ({
        id: option,
        label: <T id={`offer.${option}`} />,
      }))}
      style={{ width: 140, marginLeft: 4, marginRight: 4 }}
    />
    :
    <div className="flex center">
      <span style={{ marginLeft: 8, marginBottom: 2 }}>CHF</span>
      <TextInput
        style={{ marginLeft: 4, width: 28 }}
        inputProps={{ style: { textAlign: 'right' } }}
        value={tranche.value / 10000}
        onChange={(id, value) =>
          changeTranche(tranche.type, 'value', value * 10000)}
        type="number"
        id="value"
      />
      <span style={{ marginBottom: 2 }}>0'000</span>
    </div>
    <IconButton
      type="close"
      style={{ marginLeft: 16 }}
      tooltip={<T id="general.delete" />}
      onClick={() => deleteTranche(tranche.type)}
    />
  </div>
);

Tranche.propTypes = {
  tranche: PropTypes.objectOf(PropTypes.any).isRequired,
  changeTranche: PropTypes.func.isRequired,
  deleteTranche: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
};

export default Tranche;
