import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';
import TextInput from '../TextInput';

const renderInput = (inputProps) => {
  const {
    classes,
    autoFocus,
    value,
    ref,
    onChange,
    onBlur,
    id,
    placeholder,
    ...other
  } = inputProps;

  return (
    <TextInput
      id={`${id}autocomplete`}
      autoFocus={autoFocus}
      className={classes.textField}
      value={value}
      inputRef={ref}
      inputProps={{
        ...other,
      }}
      onChange={(_, __, event) => onChange(event)}
      onBlur={onBlur}
      classes={{ input: classes.input }}
      placeholder={placeholder}
      {...other}
    />
  );
};

const renderSuggestion = (suggestion, { isHighlighted }) => (
  <MenuItem selected={isHighlighted} component="div">
    {suggestion.label}
  </MenuItem>
);

const renderSuggestionsContainer = (options) => {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
};

const getSuggestionValue = suggestion => suggestion.value;

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative',
    marginBottom: 16,
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 3,
    left: 0,
    right: 0,
    zIndex: 1,
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
    this.state = { suggestions: [] };
  }

  handleSuggestionsFetchRequested = ({ value }) =>
    this.setState({ suggestions: this.getSuggestions(value) });

  handleSuggestionsClearRequested = () => this.setState({ suggestions: [] });

  getSuggestions = (value) => {
    const { suggestions, maxCount, filter } = this.props;
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0
      ? []
      : suggestions.filter((suggestion) => {
        const keep = count < maxCount && filter(suggestion, inputValue);
        // suggestion.label.toLowerCase().slice(0, inputLength) === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
  };

  // Fix for async data update
  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.suggestions) !==
      JSON.stringify(this.props.suggestions)
    ) {
      this.handleSuggestionsFetchRequested({ value: this.props.value });
    }
  }

  render() {
    const {
      classes,
      onSelect,
      value,
      onChange,
      onBlur,
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
          onBlur,
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
  filter: PropTypes.func,
  maxCount: PropTypes.number,
};

AutoComplete.defaultProps = {
  filter: () => true,
  label: undefined,
  maxCount: 5,
};

export default withStyles(styles)(AutoComplete);
