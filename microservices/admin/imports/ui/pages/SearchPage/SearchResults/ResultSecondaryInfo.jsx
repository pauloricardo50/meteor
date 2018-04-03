import React from 'react';
import { T, IntlDate } from 'core/components/Translation';

const ResultSecondaryInfos = ({ infos }) =>
  Object.keys(infos).map((infoKey) => {
    const info = infos[infoKey];

    return info instanceof Date ? (
      <span key={infoKey}>
        <T id={`general.${infoKey}`} />
        {': '}
        <IntlDate
          value={info}
          month="numeric"
          year="numeric"
          day="2-digit"
          hour="2-digit"
          minute="2-digit"
        />
        {', '}
      </span>
    ) : (
      <span key={infoKey}>
        <T id={`general.${infoKey}`} />
        {`: ${info}, `}
      </span>
    );
  });

export default ResultSecondaryInfos;
