import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { widget1Constants } from '../../../redux/widget1';
import Tab from '../../Material/Tab';
import Tabs from '../../Material/Tabs';
import T from '../../Translation';
import Widget1OptionsContainer from './Widget1OptionsContainer';

const Widget1Options = ({ purchaseType, setPurchaseType }) => {
  const options = Object.values(widget1Constants.PURCHASE_TYPE);

  return (
    <div className="widget1-options">
      <Tabs
        value={purchaseType}
        onChange={setPurchaseType}
        className={classnames('card1', 'purchase-type')}
      >
        {options.map(option => (
          <Tab
            key={option}
            value={option}
            label={
              <div className="label" id={option}>
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
    </div>
  );
};

Widget1Options.propTypes = {
  purchaseType: PropTypes.string.isRequired,
  setPurchaseType: PropTypes.func.isRequired,
};

export default Widget1OptionsContainer(Widget1Options);
