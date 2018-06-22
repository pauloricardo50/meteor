import React from 'react';

import T from 'core/components/Translation';
import PageHead from 'core/components/PageHead';
import MapWithMarker from 'core/components/maps/MapWithMarker';
import Button from 'core/components/Button';
import WwwLayout from '../../WwwLayout';
import { VARIANTS } from '../../WwwLayout/WwwTopNav';
import { ADDRESS, MAPS_ADDRESS } from './contactConstants';

import ContactUsForm from '../../components/ContactUsForm';
import ContactPageInformation from './ContactPageInformation';

const ContactPage = () => (
  <WwwLayout className="contact-page">
    <PageHead
      titleId="ContactPage.title"
      descriptionId="ContactPage.description"
    />
    <WwwLayout.TopNav variant={VARIANTS.GREY} />
    <WwwLayout.Content>
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
          to={`https://maps.google.com?daddr=${MAPS_ADDRESS}`}
          target="_blank"
        >
          Directions
        </Button>
        <MapWithMarker
          address={ADDRESS}
          className="map"
          options={{ zoom: 12 }}
        />
      </div>
    </WwwLayout.Content>
    <WwwLayout.Footer transparent={false}>
      <WwwLayout.Footer.Top>
        <div className="contact-footer">
          <ContactPageInformation />
        </div>
      </WwwLayout.Footer.Top>
    </WwwLayout.Footer>
  </WwwLayout>
);

export default ContactPage;
