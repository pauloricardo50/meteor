// @flow
import { withProps } from 'recompose';
import { propertyUpdate } from 'core/api';
import PropertyForm from './PropertyForm';

type PropertyModifierContainerProps = {
  property: Object,
};

const PropertyModifierContainer = withProps(({
  property: { address1, zipCode, city, value },
}: PropertyModifierContainerProps) => ({
  onSubmit: formValues =>
    propertyUpdate.run({ propertyId: property._id, object: formValues }),
  buttonLabelId: 'PropertyForm.modifierLabel',
  form: 'modify-property',
  formTitleId: 'PropertyForm.modifierDialogTitle',
  formDescriptionId: 'PropertyForm.modifierDialogDescription',
  initialValues: { address1, zipCode, city, value },
}));

export default PropertyModifierContainer(PropertyForm);
