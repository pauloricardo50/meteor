import React from 'react';

import { INTEREST_RATES } from '../../api/interestRates/interestRatesConstants';
import AutoFormDialog from '../AutoForm2/AutoFormDialog';
import Box from '../Box';
import Icon from '../Icon';
import T from '../Translation';
import OfferAdderContainer from './OfferAdderContainer';

const interestRatesLabels = Object.values(INTEREST_RATES).reduce(
  (obj, rate) => ({
    ...obj,
    [rate]: <T id={`offer.${rate}.short`} />,
    [`discount_${rate}`]: <T id={`offer.${rate}.short`} />,
  }),
  {},
);

const OfferAdder = ({ schema, insertOffer, buttonProps }) => (
  <AutoFormDialog
    schema={schema}
    onSubmit={insertOffer}
    buttonProps={{
      label: <T id="OfferAdder.buttonLabel" />,
      raised: true,
      primary: true,
      icon: <Icon type="add" />,
      ...buttonProps,
    }}
    title="Ajouter une offre"
    autoFieldProps={{ labels: interestRatesLabels }}
    fullWidth
    maxWidth="md"
    important
    layout={[
      {
        Component: Box,
        className: 'grid-2 mb-32',
        title: <h5>Général</h5>,
        fields: ['lender', 'enableOffer'],
      },
      {
        Component: Box,
        title: <h5>Offre</h5>,
        className: 'mb-32',
        layout: [
          {
            className: 'grid-3',
            fields: ['maxAmount', 'amortizationGoal', 'amortizationYears'],
          },
          { className: 'flex sb', fields: ['interest*'] },
        ],
      },
      {
        Component: Box,
        className: 'mb-32',
        title: <h5>Conditions</h5>,
        fields: ['withCounterparts', 'conditions'],
      },
      {
        Component: Box,
        className: 'mb-32 grid-2',
        title: <h5>Frais</h5>,
        fields: ['fees', 'epotekFees'],
      },
      {
        Component: Box,
        className: 'mb-32',
        title: <h5>Contreparties</h5>,
        layout: [
          'hasCounterparts',
          'counterparts',
          {
            className: 'grid-2',
            fields: ['hasFlatDiscount', 'flatDiscount'],
          },
          { className: 'flex sb', fields: ['discount_*'] },
        ],
      },
    ]}
  />
);

export default OfferAdderContainer(OfferAdder);
