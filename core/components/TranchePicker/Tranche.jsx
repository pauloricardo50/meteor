// @flow
import React from 'react';
import Button from '../Button';
import Select from '../Select';

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
    <input type="text" value={value} onChange={setValue} />
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
