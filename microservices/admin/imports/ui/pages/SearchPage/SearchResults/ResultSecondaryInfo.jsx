import React from 'react';
import { T, IntlDate, IntlNumber } from 'core/components/Translation';

const ResultSecondaryInfos = ({ infos }) =>
  Object.keys(infos).map((infoKey) => {
    const info = infos[infoKey];

    if (info instanceof Date) {
      return (
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
      );
    }

    if (infoKey === 'value') {
      return (
        <span key={infoKey}>
          <T id={`general.${infoKey}`} />
          {': '}
          <IntlNumber value={info} format="money" />
          {', '}
        </span>
      );
    }

    if (infoKey === 'assignedTo' && info === 'unassigned') {
      return (
        info && (
          <span key={infoKey}>
            <T id="general.unassigned" />
            {', '}
          </span>
        )
      );
    }

    return (
      info && (
        <span key={infoKey}>
          <T id={`general.${infoKey}`} />
          {`: ${info}, `}
        </span>
      )
    );
  });

export default ResultSecondaryInfos;
