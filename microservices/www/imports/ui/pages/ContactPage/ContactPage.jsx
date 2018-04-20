import React from 'react';
import Mailto from 'react-protected-mailto';

import { T } from 'core/components/Translation';
import MapWithMarker from 'core/components/maps/MapWithMarker';
import Icon from 'core/components/Icon';
import WwwLayout from '../../WwwLayout';
import { PHONE, EMAIL, ADDRESS } from './contactConstants';

const ContactPage = () => (
  <WwwLayout className="contact-page">
    <WwwLayout.TopNav />
    <div className="contact-info">
      <b>
        <h1>
          <T id="ContactPage.title" />
        </h1>
      </b>
      <span className="separator" />
      <div className="info">
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
      </div>
    </div>
    <div className="google-map">
      <MapWithMarker address={ADDRESS} className="map" />
    </div>
    <WwwLayout.Footer transparent={false} />
  </WwwLayout>
);

export default ContactPage;
