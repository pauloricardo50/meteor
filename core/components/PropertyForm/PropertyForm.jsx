// @flow
import React from 'react';

import { DialogForm, FIELD_TYPES } from 'core/components/Form';
import T from 'core/components/Translation';
import Button from 'core/components/Button';
import Icon from 'core/components/Icon';

const formArray = [
  { id: 'address1', fieldType: FIELD_TYPES.TEXT },
  { id: 'zipCode', fieldType: FIELD_TYPES.NUMBER },
  { id: 'city', fieldType: FIELD_TYPES.TEXT },
  { id: 'value', fieldType: FIELD_TYPES.MONEY },
].map(field => ({
  ...field,
  label: <T id={`PropertyForm.${field.id}`} />,
  required: true,
}));

type PropertyFormProps = {
  formTitleId: String,
  formDescriptionId: String,
  buttonLabelId: String,
};

const PropertyForm = ({
  formTitleId,
  formDescriptionId,
  buttonLabelId,
  ...props
}: PropertyFormProps) => (
  <div className="property-form">
    <DialogForm
      formArray={formArray}
      title={<T id={formTitleId} />}
      description={<T id={formDescriptionId} />}
      button={
        <Button raised icon={<Icon type="home" />}>
          <T id={buttonLabelId} />
        </Button>
      }
      {...props}
    />
  </div>
);

export default PropertyForm;
