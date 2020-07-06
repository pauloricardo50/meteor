import React from 'react';

import { offerDelete } from '../../api/offers/methodDefinitions';
import { AutoFormDialog } from '../AutoForm2';
import T from '../Translation';
import OfferModiferContainer from './OfferModifierContainer';
import { offerFormLayout } from '../OfferAdder/OfferAdder';

const OfferModifier = ({ onSubmit, offer, schema, ...props }) => (
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
    layout={offerFormLayout.slice(0, -1)} // Don't use last poart
    maxWidth="md"
    {...props}
  />
);

export default OfferModiferContainer(OfferModifier);
