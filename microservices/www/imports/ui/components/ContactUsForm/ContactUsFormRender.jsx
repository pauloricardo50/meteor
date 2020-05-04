import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import ContactUsForm from './ContactUsForm';
import ContactUsFormContainer from './ContactUsFormContainer';
import ContactUsFormSuccess from './ContactUsFormSuccess';

const ContactUsFormRender = ({ submitSucceeded, ...rest }) => (
  <div className="contact-us-form-wrapper">
    <ContactUsForm
      {...rest}
      className={submitSucceeded ? 'animated bounceOutDown' : ''}
    />
    <div
      className={classnames({
        'contact-us-form-success': true,
        hidden: !submitSucceeded,
        'animated zoomIn': submitSucceeded,
      })}
    >
      {submitSucceeded && <ContactUsFormSuccess />}
    </div>
  </div>
);

ContactUsFormRender.propTypes = {
  submitSucceeded: PropTypes.bool.isRequired,
};

export default ContactUsFormContainer(ContactUsFormRender);
