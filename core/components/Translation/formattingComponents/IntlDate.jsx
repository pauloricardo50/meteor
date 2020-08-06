import React, { useMemo } from 'react';
import { selectUnit } from '@formatjs/intl-utils/lib/src/diff';
import PropTypes from 'prop-types';
import {
  FormattedDate,
  FormattedRelativeTime,
  FormattedTime,
} from 'react-intl';

export const IntlDate = ({ type, ...props }) => {
  switch (type) {
    case 'time':
      return <FormattedTime {...props} />;
    case 'relative': {
      const { value, ...rest } = props;
      // Shouldn't use a hook nested here, but the type should never change anyways
      const { value: selectedValue, unit } = useMemo(() => selectUnit(value), [
        value,
      ]);

      return (
        <span title={value.toString().split(' GMT')?.[0]}>
          <FormattedRelativeTime
            unit={unit}
            value={selectedValue}
            style="short" // Can be short, long, or narrow
            {...rest}
          />
        </span>
      );
    }
    default:
      return <FormattedDate {...props} />;
  }
};

IntlDate.propTypes = {
  type: PropTypes.string,
};

export default IntlDate;
