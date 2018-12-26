// @flow
import React from 'react';

import AutoFormDialog from '../AutoForm2/AutoFormDialog';
import T from '../Translation';
import OfferAdderContainer from './OfferAdderContainer';

type OfferAdderProps = {
  schema: Object,
  insertOffer: Function,
};

const OfferAdder = ({ schema, insertOffer }: OfferAdderProps) => (
  <AutoFormDialog
    schema={schema}
    onSubmit={insertOffer}
    buttonProps={{
      label: <T id="Offer.insert" />,
      raised: true,
      primary: true,
    }}
  />
);

export default OfferAdderContainer(OfferAdder);
