import React from 'react';
import PropTypes from 'prop-types';

import Form, { makeFormArray, email, FIELD_TYPES } from 'core/components/Form';
import { T } from 'core/components/Translation';
import ContactUsFormContainer from './ContactUsFormContainer';

const formArray = makeFormArray(
  [
    { id: 'name' },
    { id: 'email', validate: [email], type: 'email' },
    { id: 'phone', fieldType: FIELD_TYPES.NUMBER, type: 'tel' },
    { id: 'details', required: false, fieldType: FIELD_TYPES.TEXT_AREA },
  ].map(field => ({ ...field, placeholder: true })),
  'ContactUsForm',
);

const ContactUsForm = ({ onSubmit }) => (
  <div className="contact-us-form card1">
    <Form
      form="contact-us"
      onSubmit={onSubmit}
      formArray={formArray}
      destroyOnUnmount={false}
      submitButtonProps={{
        label: <T id="general.continue" />,
        raised: true,
        secondary: true,
      }}
      intlPrefix="ContactUsForm"
    />
  </div>
);

ContactUsForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default ContactUsFormContainer(ContactUsForm);
