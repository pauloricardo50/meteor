import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

const FrontContactSelect = ({ contacts, contact, setContact }) => (
  <div className="front-contact-select">
    <FormControl fullWidth>
      <InputLabel shrink id="contact-select-label">
        Contact
      </InputLabel>
      <Select
        value={contact?.handle}
        onChange={event => {
          const newHandle = event.target.value;
          const newContact = contacts.find(
            ({ handle }) => handle === newHandle,
          );
          setContact(newContact);
        }}
        labelId="contact-select-label"
      >
        {contacts.map(({ handle, display_name: displayName }) => (
          <MenuItem key={handle} value={handle}>
            {(displayName && displayName.replace(/[^a-zA-Z0-9 @.-/+]/g, '')) ||
              handle}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </div>
);

export default FrontContactSelect;
