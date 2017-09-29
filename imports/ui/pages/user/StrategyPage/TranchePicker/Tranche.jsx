import React from 'react';
import PropTypes from 'prop-types';

import { T } from '/imports/ui/components/general/Translation';
import Select from '/imports/ui/components/general/Select';
import TextInput from '/imports/ui/components/general/TextInput';
import IconButton from '/imports/ui/components/general/IconButton';

const Tranche = ({ tranche, changeTranche, deleteTranche, options }) => (
  <div className="flex" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
    <T id="Tranche.tranche" />
    <Select
      label=""
      currentValue={tranche.type}
      onChange={(id, type) => changeTranche(tranche.type, 'type', type)}
      options={options.map(option => ({
        id: option,
        label: <T id={`offer.${option}`} />,
      }))}
      style={{ width: 140, marginLeft: 4, marginRight: 4 }}
    />
    :
    <div>
      <span style={{ marginLeft: 8 }}>CHF</span>
      <TextInput
        style={{ marginLeft: 4, width: 32 }}
        currentValue={tranche.value / 10000}
        onChange={(id, value) =>
          changeTranche(tranche.type, 'value', value * 10000)}
        type="number"
        id="value"
      />
      {"0'000"}
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
};

export default Tranche;
