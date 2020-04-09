import React from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';

const GoogleMapsAutocompleteSuggestion = ({
  suggestion,
  getSuggestionItemProps,
}) => {
  const {
    description,
    active,
    formattedSuggestion: { mainText, secondaryText },
  } = suggestion;
  const className = active ? 'suggestion-item-active' : 'suggestion-item';
  const listItemClassName = active ? 'list-item-active' : 'list-item';
  return (
    <MenuItem
      {...getSuggestionItemProps(suggestion, { className })}
      key={description}
    >
      <ListItemText
        className={listItemClassName}
        primary={mainText}
        secondary={secondaryText}
      />
    </MenuItem>
  );
};

export default GoogleMapsAutocompleteSuggestion;
