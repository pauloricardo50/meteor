import React from 'react';
import Mailto from 'react-protected-mailto';

import { T } from 'core/components/Translation';
import MapWithMarker from 'core/components/maps/MapWithMarker';
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
      <h3>
        <T id="ContactPage.email" /> {': '}
        <Mailto email={EMAIL} />
      </h3>
      <h3>
        <T id="ContactPage.phone" /> {': '}
        <Mailto tel={PHONE} />
      </h3>
    </div>
    <div className="google-map">
      <MapWithMarker address={ADDRESS} className="map" />
    </div>
    <WwwLayout.Footer transparent={false} />
  </WwwLayout>
);

export default ContactPage;
