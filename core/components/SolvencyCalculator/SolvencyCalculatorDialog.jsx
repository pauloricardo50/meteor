// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';

import { CANTONS } from '../../api/constants';
import { AutoFormDialog } from '../AutoForm2';
import { STATE } from './SolvencyCalculatorContainer';

type SolvencyCalculatorDialogProps = {
  loan: Object,
  state: String,
  calculateSolvency: Function,
  style: Object,
};

const SolvencyCalculatorDialog = ({
  loan,
  state,
  calculateSolvency,
  style = {},
}: SolvencyCalculatorDialogProps) => {
  const schema = new SimpleSchema({
    canton: {
      type: String,
      allowedValues: Object.keys(CANTONS),
      uniforms: { displayEmpty: false, placeholder: '' },
    },
  });

  const { maxSolvency: model } = loan;

  return (
    <AutoFormDialog
      model={model}
      schema={schema}
      onSubmit={calculateSolvency}
      title="Calculer ma capacité d'achat maximale"
      description={(
        <p className="description">
          Afin de calculer les frais de notaire, veuillez renseigner le canton
          dans lequel vous souhaitez acheter un bien immobilier.
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

export default SolvencyCalculatorDialog;
