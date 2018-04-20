import React from 'react';
import Mailto from 'react-protected-mailto';

import { T } from 'core/components/Translation';
import MapWithMarker from 'core/components/maps/MapWithMarker';
import Icon from 'core/components/Icon';
import Button from 'core/components/Button';
import WwwLayout from '../../WwwLayout';
import WwwFooterTop from '../../WwwLayout/WwwFooter/WwwFooterTop';
import { PHONE, EMAIL, ADDRESS, MAPS_ADDRESS } from './contactConstants';

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
      <ContactUsForm />
    </div>
    <div className="google-map">
      <Button
        className="directions-button"
        raised
        link
        to={`https://maps.google.com?saddr=Current+Location&daddr=${MAPS_ADDRESS}`}
        target="_blank"
      >
        Directions
      </Button>
      <MapWithMarker address={ADDRESS} className="map" />
    </div>
    <WwwLayout.Footer transparent={false}>
      <WwwLayout.Footer.Top>
        <div className="contact-footer">
          <div className="email">
            <Icon type="mail" className="icon" />
            <h3>
              <Mailto email={EMAIL} />
            </h3>
          </div>
          <div className="phone">
            <Icon type="phone" className="icon" />
            <h3>
              <Mailto tel={PHONE} />
            </h3>
          </div>
        </div>
      </WwwLayout.Footer.Top>
    </WwwLayout.Footer>
  </WwwLayout>
);

export default ContactPage;
