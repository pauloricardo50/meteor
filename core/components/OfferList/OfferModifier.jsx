// @flow
import React from 'react';

import { DialogForm } from 'core/components/Form';
import T from 'core/components/Translation';
import { baseForm, interestRatesFormArray } from '../OfferAdder/OfferAdder';
import Button from '../Button';
import OfferModiferContainer from './OfferModifierContainer';

const FORM_NAME = 'offer-modifier';
const formArray = [...baseForm, ...interestRatesFormArray()];

type OfferModifierProps = {};

const OfferModifier = ({ onSubmit, offer }: OfferModifierProps) => (
  <DialogForm
    title={<T id="OfferModifier.dialogTitle" />}
    form={FORM_NAME}
    onSubmit={onSubmit}
    initialValues={offer}
    formArray={formArray}
    destroyOnUnmount
    button={(
      <Button>
        <T id="general.modify" />
      </Button>
    )}
  />
);

export default OfferModiferContainer(OfferModifier);
