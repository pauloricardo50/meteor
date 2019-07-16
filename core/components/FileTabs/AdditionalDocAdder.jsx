// @flow
import React from 'react';

import { AutoFormDialog } from '../AutoForm2';
import AdditionalDocAdderContainer from './AdditionalDocAdderContainer';
import { getAdditionalDocSchema } from '../UploaderArray/Uploader/AdditionalDocModifier';

type AdditionalDocAdderProps = {};

const AdditionalDocAdder = ({
  onSubmit,
  collection,
}: AdditionalDocAdderProps) => (
  <AutoFormDialog
    onSubmit={onSubmit}
    buttonProps={{
      label: 'Demander document supplémentaire',
      raised: true,
      primary: true,
      className: 'additional-doc-adder',
    }}
    title="Demander document supplémentaire"
    schema={getAdditionalDocSchema(collection)}
    placeholder={false}
  />
);

export default AdditionalDocAdderContainer(AdditionalDocAdder);
