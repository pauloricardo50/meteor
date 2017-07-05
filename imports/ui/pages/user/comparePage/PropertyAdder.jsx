import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FlatButton from 'material-ui/FlatButton';

import TextInput from '/imports/ui/components/general/TextInput.jsx';
import GoogleMapsAutocomplete from '/imports/ui/components/general/GoogleMapsAutocomplete.jsx';
import GoogleMapContainer from '/imports/ui/components/general/GoogleMapContainer.jsx';

import { LoadingComponent } from '/imports/ui/components/general/Loading.jsx';

import { T } from '/imports/ui/components/general/Translation.jsx';

export default class PropertyAdder extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = (key, value) => this.setState({ [key]: value });

  handleSubmit = () => {
    const { address, value, latlng } = this.state;
    this.props.handleAddProperty(address, latlng, value, () => {
      this.props.handleClose();
    });
  };

  render() {
    const { value, isValidPlace, address, latlng, loading } = this.state;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <GoogleMapContainer>
          <GoogleMapsAutocomplete handleChange={this.handleChange} />
        </GoogleMapContainer>

        {loading && <LoadingComponent />}
        {isValidPlace
          ? <h2 className="fixed-size">
            <TextInput
              label={<T id="Comparator.value" />}
              floatingLabelFixed
              handleChange={this.handleChange}
              currentValue={value}
              id="value"
              type="money"
            />
          </h2>
          : <div style={{ height: 72 }} />}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignSelf: 'flex-end',
          }}
        >
          <FlatButton
            label={<T id="general.cancel" />}
            onTouchTap={this.props.handleClose}
          />
          <FlatButton
            primary
            label={<T id="PropertyAdder.add" />}
            onTouchTap={this.handleSubmit}
            disabled={!(isValidPlace && value)}
          />
        </div>
      </div>
    );
  }
}

PropertyAdder.propTypes = {
  handleAddProperty: PropTypes.func.isRequired,
  handleClose: PropTypes.func,
};

PropertyAdder.defaultProps = {
  handleClose: undefined,
};
