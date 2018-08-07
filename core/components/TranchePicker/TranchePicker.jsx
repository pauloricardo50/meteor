// @flow
import React from 'react';
import TranchePickerContainer from './TranchePickerContainer';
import Button from '../Button';
import Tranche from './Tranche';

type TranchePickerProps = {
  tranches: Array<{ value: number, type: string }>,
  addTranche: Function,
  removeTranche: Function,
  setValue: Function,
  setType: Function,
  options: Array<Object>,
};

export const TranchePicker = ({
  tranches,
  addTranche,
  removeTranche,
  setValue,
  setType,
  options,
}: TranchePickerProps) => (
  <div className="tranche-picker">
    {tranches.map(({ value, type }) => (
      <Tranche
        key={type}
        value={value}
        type={type}
        removeTranche={() => removeTranche(type)}
        setValue={event => setValue(type, event.target.value)}
        setType={(_, newType) => setType(type, newType)}
        options={options}
      />
    ))}
    <Button className="add" onClick={addTranche}>
      Ajouter
    </Button>
  </div>
);

export default TranchePickerContainer(TranchePicker);
