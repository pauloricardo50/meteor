import React from 'react';
import Mailto from 'react-protected-mailto';

import { T } from 'core/components/Translation';
import MapWithMarker from 'core/components/maps/MapWithMarker';
import Icon from 'core/components/Icon';
import WwwLayout from '../../WwwLayout';
import { PHONE, EMAIL, ADDRESS } from './contactConstants';

import ContactUsForm from '../../components/ContactUsForm';

const ContactPage = () => (
  <WwwLayout className="contact-page">
    <WwwLayout.TopNav />
    <div className="contact-info">
      <div className="contact-page-top">
        <b>
          <h1 className="title">
            <T id="ContactPage.title" />
          </h1>
        </b>
        <p className="description">
          <T id="ContactPage.description" />
        </p>
      </div>
      {/* <div className="info">
        <Icon type="mail" className="icon" />
        <h3>
          <Mailto email={EMAIL} />
        </h3>
      </div>
      <div className="info">
        <Icon type="phone" className="icon" />
        <h3>
          <Mailto tel={PHONE} />
        </h3>
      </div> */}
      <ContactUsForm />
    </div>
    <div className="google-map">
      <MapWithMarker address={ADDRESS} className="map" />
    </div>
    <WwwLayout.Footer transparent={false} />
  </WwwLayout>
);

export default ContactPage;
