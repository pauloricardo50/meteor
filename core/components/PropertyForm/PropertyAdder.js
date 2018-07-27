import { withProps } from 'recompose';
import { propertyInsert } from 'core/api';
import PropertyForm from './PropertyForm';

const PropertyAdderContainer = withProps(({ loanId }) => ({
  onSubmit: property => propertyInsert.run({ property, loanId }),
  buttonLabelId: 'PropertyForm.adderLabel',
  form: 'add-property',
  formTitleId: 'PropertyForm.adderDialogTitle',
  formDescriptionId: 'PropertyForm.adderDialogDescription',
}));

export default PropertyAdderContainer(PropertyForm);
