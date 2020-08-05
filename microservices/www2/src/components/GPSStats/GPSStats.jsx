import './GPSStats.scss';

import React from 'react';

import CTAButtons from '../CTAButtons';
import { RichText } from '../prismic';
import LoansMap from './LoansMap';

const GPSStats = ({ primary, fields }) => (
  <section id={primary.section_id} className="gps-stats container">
    <div className="gps-stats-content">
      {primary.content && <RichText render={primary.content} />}

      <CTAButtons buttons={fields} />
    </div>

    <LoansMap />
  </section>
);

export default GPSStats;
