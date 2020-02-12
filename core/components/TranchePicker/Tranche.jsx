import React from 'react';
import Button from '../Button';
import Select from '../Select';
import PercentInput from '../PercentInput';

const Tranche = ({
  value,
  type,
  removeTranche,
  setValue,
  setType,
  options,
}) => (
  <span className="tranche">
    <PercentInput value={value} onChange={setValue} className="value" />
    <Select
      value={type}
      onChange={setType}
      options={options}
      className="select"
    />
    <Button className="delete" onClick={removeTranche}>
      Supprimer
    </Button>
  </span>
);

export default Tranche;
