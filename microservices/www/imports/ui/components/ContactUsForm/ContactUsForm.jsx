import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import SimpleSchema from 'simpl-schema';

import AutoForm from 'core/components/AutoForm2';
// import Form, { makeFormArray, email, FIELD_TYPES } from 'core/components/Form';
import T from 'core/components/Translation';

const schema = new SimpleSchema({
  name: String,
  email: { type: String, regEx: SimpleSchema.RegEx.EmailWithTLD },
  phoneNumber: String,
  details: {
    type: String,
    required: false,
    uniforms: {
      multiline: true,
      rows: 3,
    },
  },
});

Object.keys(schema.schema()).forEach((key, i) => {
  const oldField = schema.schema()[key];
  schema.schema()[key] = {
    ...oldField,
    uniforms: {
      ...(oldField.uniforms || {}),
      label: <T id={`ContactUsForm.${key}`} />,
    },
  };
});

const ContactUsForm = ({ onSubmit, onSubmitSuccess, className }) => (
  <div
    className={classnames({ 'contact-us-form card1': true, [className]: true })}
  >
    <AutoForm
      onSubmit={onSubmit}
      onSubmitSuccess={onSubmitSuccess}
      schema={schema}
      submitFieldProps={{
        label: <T id="general.continue" />,
        primary: false,
        secondary: true,
        style: {
          alignSelf: 'flex-end',
          marginTop: 40,
          float: 'right',
          padding: 16,
        },
      }}
      placeholder
      autoFieldProps={{ intlPrefix: 'ContactUsForm' }}
    />
  </div>
);

ContactUsForm.propTypes = {
  className: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onSubmitSuccess: PropTypes.func.isRequired,
};

ContactUsForm.defaultProps = {
  className: '',
};

export default ContactUsForm;
