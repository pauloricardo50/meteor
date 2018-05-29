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
    {array.map((item) => {
      if (item.hide) {
        return null;
      } else if (item.title) {
        return (
          <h4
            className="text-center"
            {...item.props}
            key={item.label}
            style={item.labelStyle}
          >
            <T id={item.label} />
          </h4>
        );
      }
      return (
        <div
          className={classnames('fixed-size recap-item', {
            'no-scale': noScale,
            bold: item.bold,
          })}
          style={{
            marginBottom: item.spacing && 16,
            marginTop: item.spacingTop && 16,
          }}
          key={item.label}
        >
          <p>
            <T id={item.label} tooltipPlacement="bottom" />
          </p>
          <p {...item.props}>{item.value}</p>
        </div>
      );
    })}
  </div>
);

RecapSimple.propTypes = {
  className: PropTypes.string,
};

RecapSimple.defaultProps = {
  className: '',
};

export default RecapSimple;
