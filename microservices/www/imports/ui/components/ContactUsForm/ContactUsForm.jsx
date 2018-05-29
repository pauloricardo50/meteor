import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Form, { makeFormArray, email, FIELD_TYPES } from 'core/components/Form';
import T from 'core/components/Translation';

const formArray = makeFormArray(
  [
    { id: 'name' },
    { id: 'email', validate: [email], type: 'email' },
    { id: 'phone', fieldType: FIELD_TYPES.PHONE, type: 'tel' },
    { id: 'details', required: false, fieldType: FIELD_TYPES.TEXT_AREA },
  ].map(field => ({ ...field, placeholder: true })),
  'ContactUsForm',
);

const ContactUsForm = ({ onSubmit, onSubmitSuccess, className }) => (
  <div
    className={classnames({ 'contact-us-form card1': true, [className]: true })}
  >
    <Form
      form="contact-us"
      onSubmit={onSubmit}
      onSubmitSuccess={onSubmitSuccess}
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
  onSubmitSuccess: PropTypes.func.isRequired,
  className: PropTypes.string,
};

ContactUsForm.defaultProps = {
  className: '',
};

export default ContactUsForm;
