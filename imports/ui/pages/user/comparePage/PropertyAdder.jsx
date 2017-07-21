import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '/imports/ui/components/general/Button.jsx';
import Dialog from 'material-ui/Dialog';

import TextInput from '/imports/ui/components/general/TextInput.jsx';
import GoogleMapsAutocomplete from '/imports/ui/components/general/GoogleMapsAutocomplete.jsx';
import GoogleMapContainer from '/imports/ui/components/general/GoogleMapContainer.jsx';
import GoogleMap from '/imports/ui/components/general/GoogleMap.jsx';

import { T } from '/imports/ui/components/general/Translation.jsx';
import cleanMethod from '/imports/api/cleanMethods';

export default class PropertyAdder extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  handleOpen = () => this.setState({ open: true });

  handleClose = () => this.setState({ open: false });

  handleChange = (key, value) => this.setState({ [key]: value });

  handleSubmit = () => {
    const { address, value, latlng } = this.state;

    this.props.addProperty(
      {
        address,
        value,
        latitude: latlng.lat,
        longitude: latlng.lng,
      },
      this.handleClose,
    );
  };

  render() {
    const { value, isValidPlace, address, latlng, loading } = this.state;

    return (
      <div>
        <Button
          raised
          primary
          label={<T id="CompareOptions.addProperty" />}
          onTouchTap={this.handleOpen}
          style={{
            marginLeft: 8,
            marginBottom: 8,
          }}
        />
        <Dialog
          title={
            <h3>
              <T id="CompareOptions.addProperty" />
            </h3>
          }
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent
          style={{ overflow: 'unset', color: 'blue' }}
          contentStyle={{
            width: '100%',
            maxWidth: 'none',
            overflowY: 'unset',
            color: 'red',
          }}
          // To allow autocomplete to overflow, but not afterwards
          bodyStyle={isValidPlace ? {} : { overflowY: 'unset' }}
          repositionOnUpdate
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <GoogleMapsAutocomplete handleChange={this.handleChange} />
            {!!(isValidPlace && latlng) &&
              <GoogleMap
                latlng={latlng}
                address={address}
                className="property-adder-map"
              />}

            {!isValidPlace && <div style={{ height: 300 }} />}
            {isValidPlace &&
              <h2 className="fixed-size">
                <TextInput
                  label={<T id="Comparator.value" />}
                  floatingLabelFixed
                  handleChange={this.handleChange}
                  currentValue={value}
                  id="value"
                  type="money"
                />
              </h2>}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignSelf: 'flex-end',
              }}
            >
              <Button
                label={<T id="general.cancel" />}
                onTouchTap={this.handleClose}
              />
              <Button
                primary
                label={<T id="PropertyAdder.add" />}
                onTouchTap={this.handleSubmit}
                disabled={!(isValidPlace && value)}
              />
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}

PropertyAdder.propTypes = {
  addProperty: PropTypes.func.isRequired,
};
