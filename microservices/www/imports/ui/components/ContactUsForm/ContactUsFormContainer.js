import { createContainer } from 'core/api/containerToolkit/';
import { submitContactForm } from 'core/api/methods';

export default createContainer({
  onSubmit: values => submitContactForm.run(values),
});
