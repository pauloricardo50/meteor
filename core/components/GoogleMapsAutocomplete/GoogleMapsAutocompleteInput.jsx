import React from 'react';

import FormControl from '../Material/FormControl';
import Input from '../Material/Input';
import GoogleMapsAutocompleteResults from './GoogleMapsAutocompleteResults';

const GoogleMapsAutocompleteInput = ({
  getInputProps,
  suggestions,
  getSuggestionItemProps,
  loading,
}) => (
  <FormControl className="google-maps-autocomplete">
    <Input {...getInputProps({ placeholder: 'Cherchez une adresse...' })} />
    <GoogleMapsAutocompleteResults
      suggestions={suggestions}
      loading={loading}
      getSuggestionItemProps={getSuggestionItemProps}
    />
  </FormControl>
);

export default GoogleMapsAutocompleteInput;
