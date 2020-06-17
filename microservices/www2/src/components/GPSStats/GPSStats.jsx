import React from 'react';
import { RichText } from 'prismic-reactjs';
import CTAButtons from '../CTAButtons';
import useAllGPSStat from '../../hooks/useAllGPSStat';
import './GPSStats.scss';

const GPSStats = ({ primary, fields }) => {
  const gpsStats = useAllGPSStat();

  return (
    <section className="gps-stats container">
      <div className="gps-stats-content">
        {primary.content && RichText.render(primary.content)}

        <CTAButtons buttons={fields} />
      </div>

      {/* TODO: get mapping component/libray */}
      <div className="gps-stats-map">
        <ul>
          <li>
            <strong>zipCode, city, lat, long, count</strong>
          </li>
          {gpsStats &&
            gpsStats.map(gpsStat => (
              <li key={gpsStat.zipCode}>
                {gpsStat.zipCode}, {gpsStat.city}, {gpsStat.lat}, {gpsStat.long}
                , {gpsStat.count}
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default GPSStats;
