// @flow
import React from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

import Loading from '../Loading';
import GoogleMapsAutocompleteSuggestion from './GoogleMapsAutocompleteSuggestion';

type GoogleMapsAutocompleteResultsProps = {};

const styles = theme => ({
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
    top: '100%',
  },
});

const GoogleMapsAutocompleteResults = ({
  suggestions,
  loading,
  getSuggestionItemProps,
  classes: { paper },
}: GoogleMapsAutocompleteResultsProps) => {
  if (!loading && !suggestions) {
    return null;
  }

  if (!suggestions && loading) {
    return (
      <Paper className={paper} square>
        <Loading small />
      </Paper>
    );
  }

  return (
    <Paper className={paper} square>
      {suggestions.map(suggestion => (
        <GoogleMapsAutocompleteSuggestion
          suggestion={suggestion}
          getSuggestionItemProps={getSuggestionItemProps}
          key={suggestion.index}
        />
      ))}
    </Paper>
  );
};

export default withStyles(styles)(GoogleMapsAutocompleteResults);
