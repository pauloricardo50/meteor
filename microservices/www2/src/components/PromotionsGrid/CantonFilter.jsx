import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import FormattedMessage from 'core/components/Translation/FormattedMessage';

const CantonFilter = ({ canton, availableCantons = [], setCanton }) => (
  <TextField
    select
    inputProps={{ notched: true }}
    label="Canton"
    value={canton}
    onChange={event => setCanton(event.target.value)}
    className="canton-filter"
    SelectProps={{ displayEmpty: true }}
    InputLabelProps={{ shrink: true }}
  >
    {[null, ...availableCantons].map(c => (
      <MenuItem key={c} value={c}>
        <FormattedMessage id={c ? `canton.${c}` : 'all'} />
      </MenuItem>
    ))}
  </TextField>
);

export default CantonFilter;
