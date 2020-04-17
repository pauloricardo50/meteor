import { withProps } from 'recompose';

import { propertyInsert } from '../../api/properties/methodDefinitions';
import PropertyForm from './PropertyForm';

const PropertyAdderContainer = withProps(
  ({
    loanId,
    propertyUserId,
    category,
    onSubmitSuccess = x => x,
    ...rest
  }) => ({
    onSubmit: property =>
      propertyInsert
        .run({
          property: { category, ...property },
          loanId,
          userId: propertyUserId,
        })
        .then(onSubmitSuccess),
    buttonLabelId: 'PropertyForm.adderLabel',
    form: 'add-property',
    formTitleId: 'PropertyForm.adderDialogTitle',
    formDescriptionId: 'PropertyForm.adderDialogDescription',
    ...rest,
  }),
);

export default PropertyAdderContainer(PropertyForm);
