// @flow
import React from 'react';

import { toMoney } from '../../../../../utils/conversionFunctions';
import MoneyInput from '../../../../MoneyInput';
import Select from '../../../../Select';
import T from '../../../../Translation';
import FinancingStructuresDataContainer from '../../containers/FinancingStructuresDataContainer';
import { FIELDS } from './FinancingStructuresOwnFundsPickerContainer';
import {
  OWN_FUNDS_TYPES,
  OWN_FUNDS_USAGE_TYPES,
} from '../../../../../api/constants';

type FinancingStructuresOwnFundsPickerFormProps = {};

const shouldAskForUsageType = type =>
  [
    OWN_FUNDS_TYPES.INSURANCE_2,
    OWN_FUNDS_TYPES.INSURANCE_3A,
    OWN_FUNDS_TYPES.INSURANCE_3B,
    OWN_FUNDS_TYPES.BANK_3A,
  ].includes(type);

const FinancingStructuresOwnFundsPickerForm = ({
  handleSubmit,
  type,
  borrowerId,
  value,
  handleChange,
  borrowers,
  types,
  displayWarning,
  usageType,
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
          label: <T id={`Forms.${t}`} />,
        }))}
        label={<T id="FinancingStructuresOwnFundsPickerForm.type" />}
      />
      {shouldAskForUsageType(type) && (
        <Select
          value={usageType}
          onChange={(_, val) => handleChange(val, FIELDS.USAGE_TYPE)}
          options={Object.values(OWN_FUNDS_USAGE_TYPES).map(usage => ({
            id: usage,
            label: <T id={`Forms.ownFundsUsageType.${usage}`} />,
          }))}
          label={<T id="FinancingStructuresOwnFundsPickerForm.usageType" />}
        />
      )}
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
              <b>{borrowers.find(({ _id }) => _id === borrowerId).firstName}</b>
            ),
            value: <b className="primary">{toMoney(value)}</b>,
            type: (
              <b>
                <T id={`Forms.${type}`} />
              </b>
            ),
          }}
        />
      </p>
    )}
  </form>
);

export default FinancingStructuresDataContainer({ asArrays: true })(FinancingStructuresOwnFundsPickerForm);
