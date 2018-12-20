// @flow
import React from 'react';

import { DialogForm } from 'core/components/Form';
import T from 'core/components/Translation';
import { baseForm, interestRatesFormArray } from '../OfferAdder/OfferAdder';
import Button from '../Button';
import OfferModiferContainer from './OfferModifierContainer';

const FORM_NAME = 'offer-modifier';
const formArray = loanId => [...baseForm(loanId), ...interestRatesFormArray()];

type OfferModifierProps = {};

const OfferModifier = ({ onSubmit, offer, loanId }: OfferModifierProps) => (
  <DialogForm
    title={<T id="OfferModifier.dialogTitle" />}
    form={FORM_NAME}
    onSubmit={onSubmit}
    initialValues={{
      ...offer,
      organisation: offer.organisation ? offer.organisation._id : undefined,
    }}
    formArray={formArray(loanId)}
    destroyOnUnmount
    button={
      <Button>
        <T id="general.modify" />
      </Button>
    }
  />
);

export default OfferModiferContainer(OfferModifier);
