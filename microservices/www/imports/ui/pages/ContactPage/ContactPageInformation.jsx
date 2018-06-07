import React from 'react';
import Mailto from 'react-protected-mailto';
import Icon from 'core/components/Icon';
import { PHONE, EMAIL } from './contactConstants';

const ContactPageInformation = () => [
  <div className="email" key="email">
    <Icon type="mail" className="icon" />
    <h4>
      <Mailto email={EMAIL} />
    </h4>
  </div>,
  <div className="phone" key="phone">
    <Icon type="phone" className="icon" />
    <h4>
      <Mailto tel={PHONE} />
    </h4>
  </div>,
];

export default ContactPageInformation;
