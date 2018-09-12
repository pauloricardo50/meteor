// @flow
import React from 'react';

import { toMoney } from '../../../../../utils/conversionFunctions';
import MoneyInput from '../../../../MoneyInput';
import Select from '../../../../Select';
import T from '../../../../Translation';
import FinancingStructuresDataContainer from '../../containers/FinancingStructuresDataContainer';
import { FIELDS } from './FinancingStructuresOwnFundsPickerContainer';
import { OWN_FUNDS_USAGE_TYPES } from '../../../../../api/constants';
import { shouldAskForUsageType } from './FinancingStructuresOwnFundsPickerHelpers';
import FinancingStructuresOwnFundsWarning from './FinancingStructuresOwnFundsWarning';

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
  usageType,
  remaining,
  otherValueOfTypeAndBorrower,
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
          options={borrowers.map(({ _id: id, firstName }, index) => ({
            id,
            label: firstName || (
              <T id="BorrowerHeader.title" values={{ index: index + 1 }} />
            ),
          }))}
          label={<T id="FinancingStructuresOwnFundsPickerForm.borrower" />}
        />
      )}
      <MoneyInput
        value={value}
        onChange={val => handleChange(val, FIELDS.VALUE)}
        helperText={
          remaining >= 0 && (
            <T
              id="FinancingStructuresOwnFundsPickerForm.remaining"
              values={{
                value: (
                  <b className={remaining < value ? 'error' : 'primary'}>
                    {toMoney(remaining)}
                  </b>
                ),
              }}
            />
          )
        }
        label={<T id="FinancingStructuresOwnFundsPickerForm.value" />}
      />
    </div>
    {displayWarning && (
      <FinancingStructuresOwnFundsWarning
        borrowers={borrowers}
        type={type}
        borrowerId={borrowerId}
        value={value}
        otherValueOfTypeAndBorrower={otherValueOfTypeAndBorrower}
      />
    )}
  </form>
);

export default FinancingStructuresDataContainer({ asArrays: true })(FinancingStructuresOwnFundsPickerForm);
