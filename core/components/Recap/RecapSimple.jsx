import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import T from '../Translation';

const RecapSimple = ({ array, noScale, className }) => (
  <div className={`result animated fadeIn ${className}`}>
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
          className={classnames({
            'fixed-size recap-item': true,
            'no-scale': noScale,
            bold: item.bold,
          })}
          style={{
            marginBottom: item.spacing && 16,
            marginTop: item.spacingTop && 16,
          }}
          key={item.label}
        >
          <h4 className="secondary">
            <T id={item.label} tooltipPlacement="bottom" />
          </h4>
          <h3 {...item.props}>{item.value}</h3>
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
