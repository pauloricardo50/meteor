import React from 'react';

import { offerDelete } from '../../api/offers/methodDefinitions';
import { AutoFormDialog } from '../AutoForm2';
import T from '../Translation';
import OfferModiferContainer from './OfferModifierContainer';

const OfferModifier = ({ onSubmit, offer, schema }) => (
  <AutoFormDialog
    onSubmit={onSubmit}
    model={offer}
    schema={schema}
    buttonProps={{
      label: <T id="general.modify" />,
      raised: true,
      primary: true,
      style: { alignSelf: 'center' },
    }}
    onDelete={() => offerDelete.run({ offerId: offer._id })}
  />
);
export default OfferModiferContainer(OfferModifier);
