import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import T from '../Translation';

const renderLabel = ({ label, noIntl, intlValues }) => {
  if (typeof label !== 'string' || noIntl) {
    return label;
  }

  return <T id={label} values={intlValues} tooltipPlacement="bottom" />;
};

const RecapSimple = ({ array, noScale, className }) => (
  <div
    className={classnames(
      'result animated fadeIn no-responsive-typo-m',
      className,
    )}
  >
    {array.map((
      {
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
        intlValues,
      },
      index,
    ) => {
      const finalLabel = renderLabel({ label, noIntl, intlValues });
      if (hide) {
        return null;
      }
      if (space) {
        return <div key={index} style={{ height: 16 }} />;
      }
      if (title) {
        return (
          <h4
            className="text-center"
            {...props}
            key={index}
            style={labelStyle}
          >
            {finalLabel}
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
            marginBottom: spacing && 32,
            marginTop: spacingTop && 8,
          }}
          key={index}
        >
          <p>{finalLabel}</p>
          <p {...props}>{value}</p>
        </div>
      );
    })}
  </div>
);

RecapSimple.propTypes = {
  array: PropTypes.arrayOf(PropTypes.object).isRequired,
  className: PropTypes.string,
  noScale: PropTypes.bool,
};

RecapSimple.defaultProps = {
  className: '',
  noScale: false,
};

export default RecapSimple;
