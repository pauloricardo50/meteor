import { withProps } from 'recompose';
import { propertyInsert } from 'core/api';
import PropertyForm from './PropertyForm';

const PropertyAdderContainer = withProps(
  ({
    loanId,
    propertyUserId,
    category,
    buttonLabelId,
    onSubmitSuccess = x => x,
  }) => ({
    onSubmit: property =>
      propertyInsert
        .run({
          property: { category, ...property },
          loanId,
          userId: propertyUserId,
        })
        .then(onSubmitSuccess),
    buttonLabelId: buttonLabelId || 'PropertyForm.adderLabel',
    form: 'add-property',
    formTitleId: 'PropertyForm.adderDialogTitle',
    formDescriptionId: 'PropertyForm.adderDialogDescription',
  }),
);

export default PropertyAdderContainer(PropertyForm);
