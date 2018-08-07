// @flow
import React from 'react';
import Button from '../Button';
import Select from '../Select';
import PercentInput from '../PercentInput';

type TrancheProps = {
  value: number,
  type: string,
  removeTranche: Function,
  setValue: Function,
  setType: Function,
  options: Array<Object>,
};

const Tranche = ({
  value,
  type,
  removeTranche,
  setValue,
  setType,
  options,
}: TrancheProps) => (
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
