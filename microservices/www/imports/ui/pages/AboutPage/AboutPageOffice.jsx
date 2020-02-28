import React from 'react';

import MapWithMarker from 'core/components/maps/MapWithMarker';
import T from 'core/components/Translation';
import ContactPageInformation from '../ContactPage/ContactPageInformation';

export const ADDRESS = 'Place de Neuve 2, 1204 Genève';

const AboutPageOffice = () => (
  <div className="about-section about-page-office">
    <div className="about-page-office-info">
      <div className="about-page-office-info-wrapper">
        <h2>
          <T id="AboutPageOffice.title" />
        </h2>
        <p className="description">
          <T id="AboutPageOffice.description" />
        </p>
        <hr />
        <div className="about-page-office-description">
          <p className="description">
            Place de Neuve 2
            <br />
            1204 Genève
            <br />
            <br />
            Lu-Ve 8h-18h
            <br />
          </p>
          <ContactPageInformation />
        </div>
      </div>
    </div>
    <div className="about-page-office-map">
      <MapWithMarker address={ADDRESS} className="map" options={{ zoom: 12 }} />
    </div>
  </div>
);

export default AboutPageOffice;
