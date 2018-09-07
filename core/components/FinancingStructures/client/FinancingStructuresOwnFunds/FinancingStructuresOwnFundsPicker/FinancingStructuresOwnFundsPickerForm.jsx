// @flow
import React from 'react';

import MoneyInput from '../../../../MoneyInput';
import Select from '../../../../Select';
import T from '../../../../Translation';
import { FIELDS } from './FinancingStructuresOwnFundsPickerContainer';
import FinancingStructuresDataContainer from '../../containers/FinancingStructuresDataContainer';
import { toMoney } from '../../../../../utils/conversionFunctions';

type FinancingStructuresOwnFundsPickerFormProps = {};

const FinancingStructuresOwnFundsPickerForm = ({
  handleSubmit,
  type,
  borrowerId,
  value,
  handleChange,
  borrowers,
  types,
  displayWarning,
}: FinancingStructuresOwnFundsPickerFormProps) => (
  <form
    onSubmit={displayWarning ? () => {} : handleSubmit}
    className="own-funds-picker-form"
  >
    <div className="form">
      <Select
        value={type}
        onChange={(_, val) => handleChange(val, FIELDS.TYPE)}
        options={types.map(t => ({
          id: t,
          label: <T id={`FinancingStructures.${t}`} />,
        }))}
        label={<T id="FinancingStructuresOwnFundsPickerForm.type" />}
      />
      {borrowers.length > 1 && (
        <Select
          value={borrowerId}
          onChange={(_, val) => handleChange(val, FIELDS.BORROWER_ID)}
          options={borrowers.map(({ _id: id, firstName: label }) => ({
            id,
            label,
          }))}
          label={<T id="FinancingStructuresOwnFundsPickerForm.borrower" />}
        />
      )}
      <MoneyInput
        value={value}
        onChange={val => handleChange(val, FIELDS.VALUE)}
        helperText="Hello my dude"
        label={<T id="FinancingStructuresOwnFundsPickerForm.value" />}
      />
    </div>
    {displayWarning && (
      <p>
        <T
          id="FinancingStructuresOwnFundsPickerForm.warning"
          values={{
            name: (
              <b>
                {borrowers.find(({ _id }) => _id === borrowerId).firstName}
              </b>
            ),
            value: <b className="primary">{toMoney(value)}</b>,
            type: (
              <b>
                <T id={`FinancingStructures.${type}`} />
              </b>
            ),
          }}
        />
      </p>
    )}
  </form>
);

export default FinancingStructuresDataContainer({ asArrays: true })(FinancingStructuresOwnFundsPickerForm);
