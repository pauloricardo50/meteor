import React from 'react';
import { RichText } from 'prismic-reactjs';
import Button from '../Button';
import useAllGPSStat from '../../hooks/useAllGPSStat';
import './GPSStats.scss';

const GPSStats = ({ primary, fields }) => {
  const gpsStats = useAllGPSStat();

  return (
    <section className="gps-stats container">
      <div className="gps-stats-content">
        {primary.content && RichText.asText(primary.content) !== '' ? (
          <>
            {RichText.render(primary.content)}

            <div>
              {/* TODO: add logic for ExternalLink vs. Page */}
              {fields.length > 0 &&
                fields.map((field, idx) => (
                  <Button
                    key={idx}
                    className="cta--button"
                    raised
                    primary
                    link
                    to={field.cta_link.url}
                  >
                    {field.cta_text}
                  </Button>
                ))}
            </div>
          </>
        ) : null}
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
