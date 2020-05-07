import { useState } from 'react';
import { withProps } from 'recompose';

import { propertyUpdate } from '../../api/properties/methodDefinitions';
import PropertyForm from './PropertyForm';

const PropertyModifierContainer = withProps(
  ({ property: { _id, address1, zipCode, city, value } }) => {
    const [open, setOpen] = useState(false);

    return {
      onSubmit: formValues =>
        propertyUpdate.run({ propertyId: _id, object: formValues }),
      buttonLabelId: 'PropertyForm.modifierLabel',
      form: 'modify-property',
      formTitleId: 'PropertyForm.modifierDialogTitle',
      formDescriptionId: 'PropertyForm.modifierDialogDescription',
      model: { address1, zipCode, city, value },
      open,
      setOpen,
    };
  },
);

export default PropertyModifierContainer(PropertyForm);
