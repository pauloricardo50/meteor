/* eslint-disable flowtype/require-valid-file-annotation */
/* eslint-disable react/no-array-index-key */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
// import match from 'autosuggest-highlight/match';
// import parse from 'autosuggest-highlight/parse';
import { withStyles } from 'material-ui/styles';

function renderInput(inputProps) {
  const { classes, autoFocus, value, ref, onChange, ...other } = inputProps;

  return (
    <TextField
      autoFocus={autoFocus}
      className={classes.textField}
      value={value}
      inputRef={ref}
      InputProps={{
        classes: {
          input: classes.input,
        },
      }}
      onChange={e => onChange(e.target.value)}
      {...other}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  // const matches = match(suggestion.label, query);
  // const parts = parse(suggestion.label, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      {suggestion.label}
      {/* <div>
        {parts.map(
          (part, index) =>
            (part.highlight ? (
              <span key={index} style={{ fontWeight: 300 }}>
                {part.text}
              </span>
            ) : (
              <strong key={index} style={{ fontWeight: 500 }}>
                {part.text}
              </strong>
            )),
        )}
      </div> */}
    </MenuItem>
  );
}

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
}

function getSuggestionValue(suggestion) {
  return suggestion.label;
}

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative',
    // height: 200,
    marginBottom: 16,
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 3,
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  textField: {
    width: '100%',
  },
});

class AutoComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
    };
  }

  handleSuggestionsFetchRequested = ({ value }) =>
    this.setState({
      suggestions: this.getSuggestions(value),
    });

  handleSuggestionsClearRequested = () =>
    this.setState({
      suggestions: [],
    });

  getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0
      ? []
      : this.props.suggestions.filter((suggestion) => {
        const keep =
            count < 5 &&
            suggestion.label.toLowerCase().slice(0, inputLength) === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
  };

  render() {
    const {
      classes,
      onSelect,
      value,
      onChange,
      label,
      placeholder,
      disabled,
      style,
    } = this.props;

    return (
      <Autosuggest
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion,
        }}
        renderInputComponent={renderInput}
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        renderSuggestionsContainer={renderSuggestionsContainer}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={{
          classes,
          value,
          onChange,
          label,
          placeholder,
          disabled,
          style,
        }}
        onSuggestionSelected={(
          event,
          {
            suggestion,
            suggestionValue,
            suggestionIndex,
            sectionIndex,
            method,
          },
        ) => onSelect(suggestion, suggestionValue)}
      />
    );
  }
}

AutoComplete.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  suggestions: PropTypes.arrayOf(PropTypes.object).isRequired,
  classes: PropTypes.object.isRequired,
  label: PropTypes.node,
};

export default withStyles(styles)(AutoComplete);
