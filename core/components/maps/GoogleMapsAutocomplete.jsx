import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import PlacesAutocomplete, {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from 'react-places-autocomplete';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';

import { T } from 'core/components/Translation';

const defaultStyles = {
  root: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  input: {
    display: 'inline-block',
    width: '100%',
    height: '100%',
    border: 'none',
    marginTop: 14,
    padding: 0,
    textAlign: 'center',
  },
  autocompleteContainer: {
    position: 'absolute',
    top: '100%',
    backgroundColor: 'white',
    border: 'none',
    width: '100%',
    zIndex: 9999999,
    overflow: 'visible',
  },
  autocompleteItem: {
    backgroundColor: '#ffffff',
    padding: 0,
    color: '#555555',
    cursor: 'pointer',
  },
  autocompleteItemActive: {
    backgroundColor: '#fafafa',
  },
};

const styles = {
  input: {
    fontSize: 'inherit',
  },
  underline: {
    '&:before': {
      zIndex: '1',
    },
  },
};

class GoogleMapsAutocomplete extends Component {
  constructor(props) {
    super(props);
    this.state = { address: '' };
  }

  handleChange = (address) => {
    this.props.onChange('isValidPlace', false);
    this.setState({ address });
  };

  handleFormSubmit = (event, address) => {
    const { onChange } = this.props;
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.props.onChange('loading', true);
    geocodeByAddress(address || this.state.address)
      .then(results => getLatLng(results[0]))
      .then((latlng) => {
        this.props.onChange('isValidPlace', true);
        this.props.onChange('latlng', latlng);
        this.props.onChange('address', this.state.address);

        // Necessary for the dialog to resize properly after changing its contents
        Meteor.defer(() => window.dispatchEvent(new Event('resize')));
      })
      .catch((error) => {
        this.props.onChange('isValidPlace', true);
        console.error('Error', error);
      });
  };

  render() {
    const { classes } = this.props;
    const inputProps = {
      value: this.state.address,
      onChange: this.handleChange,
    };

    return (
      <h3 style={{ width: '100%' }} className="fixed-size">
        <FormControl
          style={{ width: '100%', fontSize: 'inherit', height: 100 }}
        >
          <InputLabel shrink>
            <T id="GoogleMapsAutocomplete.label" />
          </InputLabel>
          <Input
            style={{ height: '100%' }}
            autoFocus
            inputComponent={PlacesAutocomplete}
            classes={{ input: classes.input, underline: classes.underline }}
            inputProps={{
              googleLogo: false, // FIXME https://github.com/kenny-hibino/react-places-autocomplete/issues/103
              inputProps,
              autocompleteItem: ({ formattedSuggestion }) => (
                <ListItem onClick={e => e.stopPropagation()}>
                  <ListItemText
                    primary={formattedSuggestion.mainText}
                    secondary={formattedSuggestion.secondaryText}
                  />
                </ListItem>
              ),
              styles: defaultStyles,
              onSelect: address =>
                this.setState({ address }, this.handleFormSubmit),
              onEnterKeyDown: address =>
                this.setState({ address }, this.handleFormSubmit),
              highlightFirstSuggestion: true,
              options: {
                radius: 50000, // 50 km
                types: ['geocode'],
                // Bounds of Switzerland, a rectangle
                bounds: {
                  north: 47.8,
                  east: 10.48333333,
                  south: 45.81666667,
                  west: 5.95,
                },
                autoFocus: true,
              },
            }}
          />
        </FormControl>
      </h3>
    );
  }
}

GoogleMapsAutocomplete.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(GoogleMapsAutocomplete);
