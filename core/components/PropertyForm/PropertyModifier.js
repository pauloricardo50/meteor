//      
import { withProps } from 'recompose';
import { propertyUpdate } from 'core/api';
import PropertyForm from './PropertyForm';

                                       
                   
  

const PropertyModifierContainer = withProps(
  ({
    property: { _id, address1, zipCode, city, value },
  }                                ) => ({
    onSubmit: formValues =>
      propertyUpdate.run({ propertyId: _id, object: formValues }),
    buttonLabelId: 'PropertyForm.modifierLabel',
    form: 'modify-property',
    formTitleId: 'PropertyForm.modifierDialogTitle',
    formDescriptionId: 'PropertyForm.modifierDialogDescription',
    model: { address1, zipCode, city, value },
  }),
);

export default PropertyModifierContainer(PropertyForm);
