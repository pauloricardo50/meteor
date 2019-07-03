// @flow
import React from 'react';

import AutoFormDialog from '../AutoForm2/AutoFormDialog';
import T from '../Translation';
import OfferAdderContainer from './OfferAdderContainer';
import { INTEREST_RATES } from '../../api/constants';

type OfferAdderProps = {
  schema: Object,
  insertOffer: Function,
};

const interestRatesLabels = Object.values(INTEREST_RATES).reduce(
  (obj, rate) => ({
    ...obj,
    [rate]: <T id={`offer.${rate}`} />,
    [`${rate}Discount`]: <T id={`offer.${rate}`} />,
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
  />
);

export default OfferAdderContainer(OfferAdder);
