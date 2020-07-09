import React from 'react';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import FormattedMessage from 'core/components/Translation/FormattedMessage';

const CantonFilter = ({ canton, cantons = [], setCanton }) => (
  <TextField
    select
    SelectProps={{
      multiple: true,
      renderValue: selected => (
        <div className="flex center-align">
          {selected.map(value => (
            <Chip
              className="mr-4"
              key={value}
              label={
                <FormattedMessage id={value ? `canton.${value}` : 'all'} />
              }
            />
          ))}
        </div>
      ),
      onChange: event => {
        const value = event?.target?.value;

        if (value.length === 0) {
          setCanton([null]);
        } else if (!canton.includes(null) && value.includes(null)) {
          setCanton([null]);
        } else if (canton.includes(null) && value.length > 1) {
          setCanton(value.filter(x => x));
        } else {
          setCanton(value);
        }
      },
    }}
    variant="outlined"
    inputProps={{ notched: true }}
    label="Canton"
    value={canton}
  >
    {[null, ...cantons].map(c => (
      <MenuItem key={c} value={c}>
        <FormattedMessage id={c ? `canton.${c}` : 'all'} />
      </MenuItem>
    ))}
  </TextField>
);

export default CantonFilter;
