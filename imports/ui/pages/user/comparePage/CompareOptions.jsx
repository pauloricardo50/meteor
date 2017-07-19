import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '/imports/ui/components/general/Button.jsx';
import Toggle from 'material-ui/Toggle';

import { T } from '/imports/ui/components/general/Translation.jsx';
import DialogSimple from '/imports/ui/components/general/DialogSimple.jsx';
import cleanMethods from '/imports/api/cleanMethods';
import DefaultOptions from './DefaultOptions.jsx';
import AdvancedOptions from './AdvancedOptions.jsx';
import PropertyAdder from './PropertyAdder.jsx';

const styles = {
  button: {
    marginLeft: 8,
    marginBottom: 8,
  },
};

export default class CompareOptions extends Component {
  constructor(props) {
    super(props);

    this.state = { showAdvanced: false };
  }

  handleClick = callback =>
    this.setState(prev => ({ showAdvanced: !prev.showAdvanced }), callback);

  render() {
    const { showAdvanced } = this.state;
    const { handleAddProperty, comparator, changeComparator } = this.props;

    return (
      <div
        className="mask1 flex-col center"
        style={{
          marginBottom: 16,
          width: '100%',
          maxWidth: 700,
        }}
      >
        <Toggle
          style={{ width: '100%', maxWidth: 200 }}
          label={<T id="CompareOptions.useBorrowers" />}
          toggled={!comparator.useBorrowers}
          onToggle={(event, isChecked) =>
            changeComparator('useBorrowers', !isChecked)}
        />

        <DefaultOptions {...this.props} />

        {showAdvanced && <AdvancedOptions {...this.props} />}

        <div
          className="text-center"
          style={showAdvanced ? { marginTop: 20 } : {}}
        >
          <Button
            raised
            onTouchTap={() => this.handleClick()}
            label={
              <T
                id={
                  showAdvanced
                    ? 'CompareOptions.hideAdvanced'
                    : 'CompareOptions.showAdvanced'
                }
              />
            }
            style={styles.button}
          />
          <PropertyAdder handleAddProperty={handleAddProperty} />
        </div>
      </div>
    );
  }
}

CompareOptions.propTypes = {
  handleAddProperty: PropTypes.func.isRequired,
};
