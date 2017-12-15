import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from 'core/components/Button';
import Dialog from 'core/components/Material/Dialog';

import TextInput from '/imports/ui/components/general/TextInput';
import GoogleMapsAutocomplete from '/imports/ui/components/general/GoogleMapsAutocomplete';
import GoogleMap from '/imports/ui/components/general/GoogleMap';

import { T } from 'core/components/Translation';

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
      () => {
        // Reset form
        this.setState({
          address: undefined,
          value: undefined,
          latitude: undefined,
          longitude: undefined,
          isValidPlace: undefined,
        });
        this.handleClose();
      },
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
          onClick={this.handleOpen}
          style={{
            marginLeft: 8,
            marginBottom: 8,
          }}
        />
        <Dialog
          title={<T id="CompareOptions.addProperty" />}
          open={this.state.open}
          onRequestClose={this.handleClose}
          fullScreen
          actions={[
            <Button
              key={0}
              label={<T id="general.cancel" />}
              onClick={this.handleClose}
            />,
            <Button
              key={1}
              primary
              label={<T id="PropertyAdder.add" />}
              onClick={this.handleSubmit}
              disabled={!(isValidPlace && value)}
            />,
          ]}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <GoogleMapsAutocomplete onChange={this.handleChange} />
            {!!(isValidPlace && latlng) && (
              <GoogleMap
                latlng={latlng}
                address={address}
                className="property-adder-map"
                style={{ marginTop: 16 }}
              />
            )}

            {!isValidPlace && <div style={{ height: 300 }} />}
            {isValidPlace && (
              <h2 className="fixed-size">
                <form
                  action="submit"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (value) {
                      this.handleSubmit();
                    }
                  }}
                  noValidate
                >
                  <TextInput
                    label={<T id="Comparator.value" />}
                    onChange={this.handleChange}
                    value={value}
                    id="value"
                    type="money"
                    inputProps={{ style: { paddingTop: 16 } }}
                  />
                </form>
              </h2>
            )}
          </div>
        </Dialog>
      </div>
    );
  }
}

PropertyAdder.propTypes = {
  addProperty: PropTypes.func.isRequired,
};
