import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dialog from '/imports/ui/components/general/Material/Dialog';

import { T } from 'core/components/Translation';
import IconButton from '../IconButton';
import Button from '../Button';
import Search from './Search';

export default class SearchModal extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };
  }

  handleOpen = () => this.setState({ isOpen: true });
  handleClose = () => this.setState({ isOpen: false });

  render() {
    const { isOpen } = this.state;
    return (
      <span>
        <IconButton
          type="search"
          onClick={this.handleOpen}
          // tooltip={<T id="general.search" />}
          // tooltipPlacement="bottom-end"
        />
        <Dialog
          fullScreen
          title={<T id="general.search" />}
          actions={[
            <Button
              onClick={this.handleClose}
              key={0}
              label={<T id="general.close" />}
            />,
          ]}
          open={isOpen}
          onRequestClose={this.handleClose}
        >
          <Search />
        </Dialog>
      </span>
    );
  }
}

SearchModal.propTypes = {};
