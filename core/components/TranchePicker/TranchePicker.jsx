// @flow
import React from 'react';
import TranchePickerContainer from './TranchePickerContainer';
import Button from '../Button';
import Tranche from './Tranche';
import { INTEREST_RATES } from '../../api/constants';

type TranchePickerProps = {
  tranches: Array<{ value: number, type: string }>,
  addTranche: Function,
  removeTranche: Function,
  setValue: Function,
  setType: Function,
  options: Array<Object>,
};

const interestRatesOrder = Object.values(INTEREST_RATES);

const filterOptions = (options, tranches, currentType) => {
  const currentSelectedTypes = tranches.map(({ type }) => type);
  const difference = options.filter(({ id }) => !currentSelectedTypes.includes(id));
  const currentOption = options.find(({ id }) => id === currentType);
  const withCurrentType = currentOption
    ? [...difference, currentOption]
    : difference;

  const sortedOptions = withCurrentType.sort(({ id: id1 }, { id: id2 }) =>
    interestRatesOrder.indexOf(id1) - interestRatesOrder.indexOf(id2));
  return sortedOptions;
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
        setValue={newValue => setValue(type, newValue)}
        setType={newType => setType(type, newType)}
        options={filterOptions(options, tranches, type)}
      />
    ))}
    <Button className="add" primary onClick={addTranche}>
      Ajouter
    </Button>
  </div>
);

export default TranchePickerContainer(TranchePicker);
