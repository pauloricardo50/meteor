import React from 'react';
import DropdownMenu from '../core/components/DropdownMenu';

const FrontContactSelect = ({
  contacts = [],
  contact: currentContact,
  setContact,
}) => contacts.length > 1 ? (
  <div className="front-contact-select">
    <DropdownMenu
      options={contacts.map(contact => {
        const { handle, display_name: displayName } = contact;
        return {
          label:
            (displayName && displayName.replace(/[^a-zA-Z0-9 @.-/+]/g, '')) ||
            handle,
          onClick: () => {
            setContact(contact);
          },
          secondary: handle === currentContact.handle && 'Courant',
        };
      })}
      iconType="group"
      tooltip="Contact"
    />
  </div>
) : null;

export default FrontContactSelect;
