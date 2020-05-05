import React, { useMemo } from 'react';

import { AutoFormDialog } from '../AutoForm2';
import { getAdditionalDocSchema } from '../UploaderArray/Uploader/AdditionalDocModifier';
import AdditionalDocAdderContainer from './AdditionalDocAdderContainer';

const AdditionalDocAdder = ({ onSubmit, collection }) => {
  const schema = useMemo(() => getAdditionalDocSchema(collection), []);

  return (
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
};

export default AdditionalDocAdderContainer(AdditionalDocAdder);
