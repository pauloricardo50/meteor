import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import T from '../Translation';

const RecapSimple = ({ array, noScale, className }) => (
  <div
    className={classnames(
      'result animated fadeIn no-responsive-typo-m',
      className,
    )}
  >
    {array.map(({
      hide,
      space,
      title,
      props,
      label,
      labelStyle,
      noIntl,
      bold,
      spacing,
      spacingTop,
      value,
    }) => {
      if (hide) {
        return null;
      } else if (space) {
        return <div style={{ height: 16 }} />;
      } else if (title) {
        return (
          <h4
            className="text-center"
            {...props}
            key={label}
            style={labelStyle}
          >
            {noIntl ? label : <T id={label} />}
          </h4>
        );
      }
      return (
        <div
          className={classnames('fixed-size recap-item', {
            'no-scale': noScale,
            bold,
          })}
          style={{
            marginBottom: spacing && 16,
            marginTop: spacingTop && 16,
          }}
          key={label}
        >
          <p>{noIntl ? label : <T id={label} tooltipPlacement="bottom" />}</p>
          <p {...props}>{value}</p>
        </div>
      );
    })}
  </div>
);

RecapSimple.propTypes = {
  array: PropTypes.arrayOf(PropTypes.object).isRequired,
  noScale: PropTypes.bool,
  className: PropTypes.string,
};

RecapSimple.defaultProps = {
  className: '',
  noScale: false,
};

export default RecapSimple;
