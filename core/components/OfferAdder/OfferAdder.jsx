// @flow
import React from 'react';

import AutoFormDialog from '../AutoForm2/AutoFormDialog';
import T from '../Translation';
import OfferAdderContainer from './OfferAdderContainer';
import { INTEREST_RATES } from '../../api/constants';
import Box from '../Box';

type OfferAdderProps = {
  schema: Object,
  insertOffer: Function,
};

const interestRatesLabels = Object.values(INTEREST_RATES).reduce(
  (obj, rate) => ({
    ...obj,
    [rate]: <T id={`offer.${rate}.short`} />,
    [`discount_${rate}`]: <T id={`offer.${rate}.short`} />,
  }),
  {},
);

const OfferAdder = ({ schema, insertOffer, buttonProps }: OfferAdderProps) => (
  <AutoFormDialog
    schema={schema}
    onSubmit={insertOffer}
    buttonProps={{
      label: <T id="OfferAdder.buttonLabel" />,
      raised: true,
      primary: true,
      ...buttonProps,
    }}
    title={<T id="OfferAdder.buttonLabel" />}
    autoFieldProps={{ labels: interestRatesLabels }}
    fullWidth
    maxWidth="md"
    layout={[
      {
        Component: Box,
        className: 'flex mb-32',
        title: <h4>Général</h4>,
        fields: ['lender', 'enableOffer'],
      },
      {
        Component: Box,
        title: <h4>Offre</h4>,
        className: 'mb-32',
        layout: [
          'maxAmount',
          {
            className: 'grid-2',
            fields: ['amortizationGoal', 'amortizationYears'],
          },
          { className: 'flex flex--sb', fields: ['interest*'] },
        ],
      },
      {
        Component: Box,
        className: 'mb-32',
        title: <h4>Conditions</h4>,
        fields: ['withCounterparts', 'conditions'],
      },
      {
        Component: Box,
        className: 'mb-32 grid-2',
        title: <h4>Frais</h4>,
        fields: ['fees', 'epotekFees'],
      },
      {
        Component: Box,
        className: 'mb-32',
        title: <h4>Contreparties</h4>,
        layout: [
          'hasCounterparts',
          'counterparts',
          {
            className: 'grid-2',
            fields: ['hasFlatDiscount', 'flatDiscount'],
          },
          { className: 'flex flex--sb', fields: ['discount_*'] },
        ],
      },
    ]}
  />
);

export default OfferAdderContainer(OfferAdder);
