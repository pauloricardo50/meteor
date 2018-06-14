import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import T from 'core/components/Translation';

const Widget1OptionSelector = ({ options, value, onChange, className }) => (
  <Tabs
    value={value}
    onChange={onChange}
    className={classnames('card1', className)}
  >
    {options.map(option => (
      <Tab
        key={option}
        value={option}
        label={
          <div className="label">
            <img src={`/img/widget1_${option}.svg`} alt={option} />
            <h4>
              <T id={`Widget1OptionSelector.${option}`} />
            </h4>
          </div>
        }
        className="widget1-option"
      />
    ))}
  </Tabs>
);

Widget1OptionSelector.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
};

export default Widget1OptionSelector;
