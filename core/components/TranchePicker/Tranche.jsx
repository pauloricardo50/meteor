import React from 'react';

import Button from '../Button';
import InputAdornment from '../Material/InputAdornment';
import MoneyInput from '../MoneyInput';
import Select from '../Select';

const Tranche = ({
  value,
  type,
  removeTranche,
  setValue,
  setType,
  options,
  wantedLoan,
}) => (
  <span className="tranche">
    <MoneyInput
      value={value}
      onChange={setValue}
      className="value"
      endAdornment={
        <InputAdornment position="end">
          <span className="secondary">
            {Math.round((100 * value) / wantedLoan)}&nbsp;%
          </span>
        </InputAdornment>
      }
    />
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
