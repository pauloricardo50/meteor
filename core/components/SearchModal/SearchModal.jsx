import React from 'react';
import PropTypes from 'prop-types';
import { withStateHandlers } from 'recompose';

import Dialog from '../Material/Dialog';
import T from '../Translation';
import IconButton from '../IconButton';
import Button from '../Button';
import Search from './Search';

export const SearchModal = ({ isOpen, handleOpen, handleClose }) => (
  <>
    <IconButton type="search" onClick={handleOpen} />
    <Dialog
      fullScreen
      title={<T id="general.search" />}
      actions={[
        <Button
          onClick={handleClose}
          key={0}
          label={<T id="general.close" />}
        />,
      ]}
      open={isOpen}
      onClose={handleClose}
    >
      <Search />
    </Dialog>
  </>
);

SearchModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  handleOpen: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default withStateHandlers(
  { isOpen: false },
  {
    handleOpen: () => () => ({ isOpen: true }),
    handleClose: () => () => ({ isOpen: false }),
  },
)(SearchModal);
