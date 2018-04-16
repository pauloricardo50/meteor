import React from 'react';
import PropTypes from 'prop-types';

import { DialogForm, FIELD_TYPES } from 'core/components/Form';
import { T } from 'core/components/Translation';
import Button from 'core/components/Button';
import { INTEREST_RATES } from 'core/api/constants';
import OfferAdderContainer from './OfferAdderContainer';
import { FORM_NAME, HAS_COUNTERPARTS, IS_DISCOUNT } from './constants';

const interestRatesFormArray = index =>
  Object.values(INTEREST_RATES).map(rate => ({
    id: `${rate}-${index}`,
    type: FIELD_TYPES.PERCENT,
    label: <T id={`offer.${rate}`} />,
    required: false,
    defaultValue: 0,
  }));

const baseForm = [
  { id: 'organization' },
  { id: 'maxAmount', type: FIELD_TYPES.MONEY },
  { id: 'amortization', type: FIELD_TYPES.MONEY },
  { id: 'condition' },
  ...interestRatesFormArray(1),
  { id: HAS_COUNTERPARTS, type: FIELD_TYPES.CHECKBOX },
];

const counterpartsForm = isDiscount => [
  ...[{ id: 'counterparts' }, { id: IS_DISCOUNT, type: FIELD_TYPES.CHECKBOX }],
  ...(isDiscount
    ? [{ id: 'discount', type: FIELD_TYPES.PERCENT }]
    : [...interestRatesFormArray(2)]),
];

const getFormArray = (hasCounterparts, isDiscount) =>
  (hasCounterparts
    ? [...baseForm, ...counterpartsForm(isDiscount)]
    : baseForm
  ).map(field => ({
    ...field,
    required: field.required ? field.required : true,
    label: field.label || <T id={`OfferAdder.${field.id}`} />,
  }));

const OfferAdder = ({ hasCounterparts, isDiscount }) => (
  <DialogForm
    form={FORM_NAME}
    button={
      <Button raised primary>
        <T id="OfferAdder.buttonLabel" />
      </Button>
    }
    title={<T id="OfferAdder.dialogTitle" />}
    description={<T id="OfferAdder.dialogDescription" />}
    formArray={getFormArray(hasCounterparts, isDiscount)}
    destroyOnUnmount={false}
  />
);

OfferAdder.propTypes = {
  hasCounterparts: PropTypes.bool,
  isDiscount: PropTypes.bool,
};

OfferAdder.defaultProps = {
  hasCounterparts: false,
  isDiscount: false,
};

export default OfferAdderContainer(OfferAdder);
