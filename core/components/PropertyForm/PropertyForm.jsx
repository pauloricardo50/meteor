// @flow
import * as React from 'react';
import cx from 'classnames';

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
  button?: React.Node,
  className?: string,
};

const PropertyForm = ({
  formTitleId,
  formDescriptionId,
  buttonLabelId,
  button,
  className = '',
  ...props
}: PropertyFormProps) => (
  <div
    className={cx('property-form', className)}
    // Prevent Link to be fired on DashboardPage
    onClick={e => e.preventDefault()}
  >
    <DialogForm
      formArray={formArray}
      title={<T id={formTitleId} />}
      description={<T id={formDescriptionId} />}
      button={
        button || (
          <Button raised primary icon={<Icon type="home" />}>
            <T id={buttonLabelId} />
          </Button>
        )
      }
      {...props}
    />
  </div>
);

export default PropertyForm;
