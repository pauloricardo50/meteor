import React from 'react';

import { AutoFormDialog } from '../AutoForm2';
import AdditionalDocAdderContainer from './AdditionalDocAdderContainer';
import { getAdditionalDocSchema } from '../UploaderArray/Uploader/AdditionalDocModifier';

const AdditionalDocAdder = ({ onSubmit, collection }) => (
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
