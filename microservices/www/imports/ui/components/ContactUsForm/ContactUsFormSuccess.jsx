import React from 'react';

import AnimatedSuccess from 'core/components/AnimatedSuccess';
import T from 'core/components/Translation';

const ContactUsFormSuccess = () => (
  <div className="contact-us-form-success">
    <AnimatedSuccess />
    <h2>
      <T id="ContactUsFormSuccess.text" />
    </h2>
  </div>
);

export default ContactUsFormSuccess;
