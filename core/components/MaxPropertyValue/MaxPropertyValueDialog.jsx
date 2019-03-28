// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';

import { CANTONS } from '../../api/constants';
import { AutoFormDialog } from '../AutoForm2';
import { STATE } from './MaxPropertyValueContainer';

type MaxPropertyValueDialogProps = {
  loan: Object,
  state: String,
  calculateSolvency: Function,
  style: Object,
};

const schema = new SimpleSchema({
  canton: {
    type: String,
    allowedValues: Object.keys(CANTONS),
    uniforms: { displayEmpty: false, placeholder: '' },
  },
});

const MaxPropertyValueDialog = ({
  loan,
  state,
  calculateSolvency,
  style = {},
}: MaxPropertyValueDialogProps) => {
  const { maxPropertyValue: model } = loan;

  return (
    <AutoFormDialog
      model={model}
      schema={schema}
      onSubmit={calculateSolvency}
      title="Calculer ma capacité d'achat maximale"
      description={(
        <p className="description">
          Indiquez nous le canton dans lequel vous souhaitez acheter. Nous
          pourrons alors calculer précisément les frais de notaire, et prendre
          en compte les spécificités des prêteurs dans ce canton.
        </p>
      )}
      buttonProps={{
        raised: true,
        primary: true,
        label: state === STATE.EMPTY ? 'Calculer' : 'Recalculer',
        style: { aligSelf: 'center', marginTop: '8px', ...style },
      }}
    />
  );
};

export default MaxPropertyValueDialog;
