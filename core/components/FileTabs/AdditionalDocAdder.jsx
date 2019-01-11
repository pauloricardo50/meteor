// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';

import { AutoFormDialog } from '../AutoForm2';
import AdditionalDocAdderContainer from './AdditionalDocAdderContainer';

type AdditionalDocAdderProps = {};

const schema = new SimpleSchema({
  label: {
    type: String,
    uniforms: {
      label: 'Nom du document supplémentaire',
      placeholder: null,
    },
  },
});

const AdditionalDocAdder = ({ onSubmit }: AdditionalDocAdderProps) => (
  <AutoFormDialog
    onSubmit={onSubmit}
    buttonProps={{
      label: 'Demander document supplémentaire',
      raised: true,
      primary: true,
      className: 'additional-doc-adder',
    }}
    title="Demander document supplémentaire"
    schema={schema}
    placeholder={false}
  />
);

export default AdditionalDocAdderContainer(AdditionalDocAdder);
