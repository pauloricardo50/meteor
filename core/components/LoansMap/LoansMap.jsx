import React, { useEffect, useState } from 'react';

import useMedia from 'core/hooks/useMedia';

import { getGpsStats } from '../../api/gpsStats/methodDefinitions';
import CityMarker from './CityMarker';

const cantons = ['GE', 'VD', 'NE', 'JU', 'VS', 'FR'];

const LoansMap = () => {
  const isHiDPI = useMedia({ maxWidth: 1440 });
  const isMDPI = useMedia({ maxWidth: 1280 });
  const isLDPI = useMedia({ maxWidth: 1024 });
  const isMobile = useMedia({ maxWidth: 800 });

  const [gpsStats, setGpsStats] = useState();
  useEffect(async () => {
    const stats = await getGpsStats.run({ cantons });
    setGpsStats(stats);
  }, []);

  const size = isMobile
    ? 350
    : isLDPI
    ? 500
    : isMDPI
    ? 600
    : isHiDPI
    ? 800
    : 1000;

  return (
    <div style={{ position: 'relative' }}>
      <img
        style={{ position: 'absolute', top: 0, left: 0 }}
        src="/img/romandy-map.svg"
        width={size}
        height={size}
      />

      {gpsStats?.length &&
        gpsStats.map(city => (
          <CityMarker key={city.zipCode} city={city} mapSize={size} />
        ))}
    </div>
  );
};

export default LoansMap;
