import React, { Component } from 'react';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';

import { T } from '/imports/ui/components/general/Translation.jsx';
import DialogSimple from '/imports/ui/components/general/DialogSimple.jsx';
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
    const { handleAddProperty } = this.props;

    return (
      <div
        className="mask1"
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginBottom: 16,
          width: '100%',
          maxWidth: 800,
        }}
      >
        <DefaultOptions {...this.props} />
        {showAdvanced && <AdvancedOptions {...this.props} />}
        <div
          className="text-center"
          style={showAdvanced ? { marginTop: 20 } : {}}
        >
          <RaisedButton
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
          <DialogSimple
            primary
            label={<T id="CompareOptions.addProperty" />}
            title={<T id="CompareOptions.addProperty" />}
            buttonStyle={styles.button}
            passProps
            actions={[]}
            bodyStyle={{ overflowY: 'visible' }} // required to show the google place autocomplete
          >
            <PropertyAdder handleAddProperty={handleAddProperty} />
          </DialogSimple>
        </div>
      </div>
    );
  }
}

CompareOptions.propTypes = {
  handleAddProperty: PropTypes.func.isRequired,
};
