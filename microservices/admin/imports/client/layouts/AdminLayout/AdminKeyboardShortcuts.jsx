//
import React from 'react';
import { GlobalHotKeys } from 'react-hotkeys';

const keyMap = {
  SEARCH: 'space',
};

const makeHandlers = ({ setOpenSearch }) => ({
  SEARCH: e => {
    // Prevent the space key to be sent to the search input
    e.preventDefault();
    setOpenSearch(true);
  },
});

const AdminKeyboardShortcuts = ({ setOpenSearch }) => (
  <GlobalHotKeys keyMap={keyMap} handlers={makeHandlers({ setOpenSearch })} />
);

export default AdminKeyboardShortcuts;
