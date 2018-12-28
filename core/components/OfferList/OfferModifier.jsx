// @flow
import React from 'react';

import { AutoFormDialog } from '../AutoForm2';
import T from '../Translation';
import Button from '../Button';
import OfferModiferContainer from './OfferModifierContainer';
import { offerDelete } from '../../api';

type OfferModifierProps = {};

const OfferModifier = ({ onSubmit, offer, schema }: OfferModifierProps) => (
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
    renderAdditionalActions={({ closeDialog }) => (
      <Button
        onClick={() => {
          const confirm = window.confirm("T'es sûr mon pote?");
          if (confirm) {
            offerDelete.run({ offerId: offer._id }).then(closeDialog);
          } else {
            return Promise.resolve();
          }
        }}
        error
      >
        <T id="general.delete" />
      </Button>
    )}
  />
);

export default OfferModiferContainer(OfferModifier);
