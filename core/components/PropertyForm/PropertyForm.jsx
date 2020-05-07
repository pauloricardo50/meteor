import * as React from 'react';
import cx from 'classnames';

import PropertySchema from '../../api/properties/schemas/PropertySchema';
import { AutoFormDialog } from '../AutoForm2/AutoFormDialog';
import Icon from '../Icon';
import T from '../Translation';

export const propertyFormSchema = PropertySchema.pick(
  'address1',
  'zipCode',
  'city',
  'country',
  'value',
);

export const propertyFormLayout = [
  'value',
  'address1',
  { className: 'grid-col', fields: ['zipCode', 'city', 'country'] },
];

const PropertyForm = ({
  formTitleId,
  formDescriptionId,
  buttonLabelId,
  className = '',
  disabled,
  buttonProps,
  schema = propertyFormSchema,
  ...props
}) => (
  <div
    className={cx('property-form', className)}
    onClick={event => {
      // Prevent all event defaults except when submitting
      // In this case, the skip is handled by DashboardRecapProperty
      if (event.target.type !== 'submit') {
        event.preventDefault();
      }
    }}
  >
    <AutoFormDialog
      schema={schema}
      title={<T id={formTitleId} />}
      description={<T id={formDescriptionId} />}
      buttonProps={{
        raised: true,
        primary: true,
        icon: <Icon type="home" />,
        label: <T id={buttonLabelId} />,
        disabled,
        ...buttonProps,
      }}
      layout={propertyFormLayout}
      {...props}
    />
  </div>
);

export default PropertyForm;
