import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '/imports/ui/components/general/Button';
import Toggle from 'material-ui/Toggle';

import { T } from '/imports/ui/components/general/Translation';
import DefaultOptions from './DefaultOptions';
import AdvancedOptions from './AdvancedOptions';
import PropertyAdder from './PropertyAdder';

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
    const { comparator, changeComparator, addProperty } = this.props;

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
            onClick={() => this.handleClick()}
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
          <PropertyAdder addProperty={addProperty} />
        </div>
      </div>
    );
  }
}

CompareOptions.propTypes = {
  comparator: PropTypes.objectOf(PropTypes.any).isRequired,
  changeComparator: PropTypes.func.isRequired,
  addProperty: PropTypes.func.isRequired,
};
