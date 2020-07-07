import './GPSStats.scss';

import React from 'react';
import { RichText } from 'prismic-reactjs';

import CTAButtons from '../CTAButtons';
import LoansMap from './LoansMap';

const GPSStats = ({ primary, fields }) => (
  <section className="gps-stats container">
    <div className="gps-stats-content">
      {primary.content && RichText.render(primary.content)}

      <CTAButtons buttons={fields} />
    </div>

    <div className="gps-stats-map">
      <LoansMap />
    </div>
  </section>
);
export default GPSStats;
