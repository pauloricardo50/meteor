//
import React from 'react';

import { toMoney } from '../../../../../utils/conversionFunctions';
import MoneyInput from '../../../../MoneyInput';
import Select from '../../../../Select';
import T from '../../../../Translation';
import FinancingDataContainer from '../../containers/FinancingDataContainer';
import { FIELDS } from './FinancingOwnFundsPickerContainer';
import { OWN_FUNDS_USAGE_TYPES } from '../../../../../api/constants';
import { shouldAskForUsageType } from './FinancingOwnFundsPickerHelpers';
import FinancingOwnFundsWarning from './FinancingOwnFundsWarning';

const FinancingOwnFundsPickerForm = ({
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
  allowPledge,
  handleUpdateBorrower,
}) => (
  <form
    onSubmit={displayWarning ? handleUpdateBorrower : handleSubmit}
    className="own-funds-picker-form"
  >
    <div className="form">
      <Select
        value={type}
        onChange={val => handleChange(val, FIELDS.TYPE)}
        options={types.map(t => ({
          id: t,
          label: <T id={`Forms.${t}`} />,
        }))}
        label={<T id="FinancingOwnFundsPickerForm.type" />}
      />
      {allowPledge && shouldAskForUsageType(type) && (
        <Select
          value={usageType}
          onChange={val => handleChange(val, FIELDS.USAGE_TYPE)}
          options={Object.values(OWN_FUNDS_USAGE_TYPES).map(usage => ({
            id: usage,
            label: <T id={`Forms.ownFundsUsageType.${usage}`} />,
          }))}
          label={<T id="FinancingOwnFundsPickerForm.usageType" />}
        />
      )}
      {borrowers.length > 1 && (
        <Select
          value={borrowerId}
          onChange={val => handleChange(val, FIELDS.BORROWER_ID)}
          options={borrowers.map(({ _id: id, firstName }, index) => ({
            id,
            label: firstName || (
              <T id="BorrowerHeader.title" values={{ index: index + 1 }} />
            ),
          }))}
          label={<T id="FinancingOwnFundsPickerForm.borrower" />}
        />
      )}
      <MoneyInput
        value={value}
        onChange={val => handleChange(val, FIELDS.VALUE)}
        helperText={
          remaining >= 0 && (
            <T
              id="FinancingOwnFundsPickerForm.remaining"
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
        label={<T id="FinancingOwnFundsPickerForm.value" />}
      />
    </div>
    {displayWarning && (
      <FinancingOwnFundsWarning
        type={type}
        borrower={borrowers.find(({ _id }) => _id === borrowerId)}
        borrowerIndex={borrowers.findIndex(({ _id }) => _id === borrowerId)}
        value={value}
        otherValueOfTypeAndBorrower={otherValueOfTypeAndBorrower}
      />
    )}
  </form>
);

export default FinancingDataContainer(FinancingOwnFundsPickerForm);
