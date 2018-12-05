import React from 'react';
import PropTypes from 'prop-types';

import adminOrganisations from 'core/api/organisations/queries/adminOrganisations';
import { DialogForm, FIELD_TYPES } from '../Form';
import T from '../Translation';
import Button from '../Button';
import { INTEREST_RATES } from '../../api/constants';
import OfferAdderContainer from './OfferAdderContainer';
import { FORM_NAME, HAS_COUNTERPARTS, IS_DISCOUNT } from './constants';

export const interestRatesFormArray = index =>
  Object.values(INTEREST_RATES).map(rate => ({
    id: index ? `${rate}-${index}` : rate,
    fieldType: FIELD_TYPES.PERCENT,
    label: <T id={`offer.${rate}`} />,
    required: false,
    defaultValue: 0,
  }));

export const baseForm = [
  {
    id: 'organisation',
    fieldType: FIELD_TYPES.SELECT,
    fetchOptions: () =>
      new Promise((resolve, reject) =>
        adminOrganisations
          .clone()
          .fetch((err, res) =>
            (err
              ? reject(err)
              : resolve(res.map(({ name, _id }) => ({ label: name, id: _id })))))),
  },
  {
    id: 'maxAmount',
    fieldType: FIELD_TYPES.MONEY,
    label: <T id="offer.maxAmount" />,
  },
  {
    id: 'fees',
    fieldType: FIELD_TYPES.MONEY,
    label: <T id="offer.fees" />,
  },
  {
    id: 'epotekFees',
    fieldType: FIELD_TYPES.MONEY,
    label: <T id="offer.epotekFees" />,
  },
  {
    id: 'amortizationGoal',
    fieldType: FIELD_TYPES.PERCENT,
    label: <T id="offer.amortizationGoal" />,
  },
  {
    id: 'amortizationYears',
    fieldType: FIELD_TYPES.NUMBER,
    label: <T id="offer.amortizationYears" />,
    helperText: 'Automatique par défaut',
  },
  {
    id: 'conditions',
    label: <T id="offer.conditions" />,
    required: false,
  },
];

export const standardForm = [
  ...baseForm,
  ...interestRatesFormArray(1),
  { id: HAS_COUNTERPARTS, fieldType: FIELD_TYPES.CHECKBOX },
];

const counterpartsForm = isDiscount => [
  ...[
    {
      id: 'counterparts',
      label: <T id="offer.counterparts" />,
    },
    { id: IS_DISCOUNT, fieldType: FIELD_TYPES.CHECKBOX },
  ],
  ...(isDiscount
    ? [{ id: 'discount', fieldType: FIELD_TYPES.PERCENT }]
    : [...interestRatesFormArray(2)]),
];

const getFormArray = (hasCounterparts, isDiscount) =>
  (hasCounterparts
    ? [...standardForm, ...counterpartsForm(isDiscount)]
    : standardForm
  ).map(field => ({
    ...field,
    required: field.required !== undefined ? field.required : true,
    label: field.label || <T id={`OfferAdder.${field.id}`} />,
  }));

const OfferAdder = ({ hasCounterparts, isDiscount, onSubmit }) => (
  <DialogForm
    form={FORM_NAME}
    onSubmit={onSubmit}
    button={(
      <Button raised primary>
        <T id="OfferAdder.buttonLabel" />
      </Button>
    )}
    title={<T id="OfferAdder.dialogTitle" />}
    description={<T id="OfferAdder.dialogDescription" />}
    formArray={getFormArray(hasCounterparts, isDiscount)}
    destroyOnUnmount={false}
    initialValues={{ [IS_DISCOUNT]: true }}
    enableReinitialize
  />
);

OfferAdder.propTypes = {
  hasCounterparts: PropTypes.bool,
  isDiscount: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
};

OfferAdder.defaultProps = {
  hasCounterparts: false,
  isDiscount: false,
};

export default OfferAdderContainer(OfferAdder);
