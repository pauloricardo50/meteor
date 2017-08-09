import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SearchIcon from 'material-ui/svg-icons/action/search';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';

import { T } from '/imports/ui/components/general/Translation.jsx';
import Button from './Button.jsx';
import Search from './Search.jsx';

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
          tooltip={<T id="general.search" />}
          onTouchTap={this.handleOpen}
          touch
          tooltipPosition="bottom-left"
        >
          <SearchIcon color="#444" hoverColor="#888" />
        </IconButton>
        <Dialog
          title={
            <h3>
              <T id="general.search" />
            </h3>
          }
          actions={[
            <Button
              onTouchTap={this.handleClose}
              key={0}
              label={<T id="general.close" />}
            />,
          ]}
          open={isOpen}
          onRequestClose={this.handleClose}
          autoScrollBodyContent
          repositionOnUpdate={false}
          autoDetectWindowHeight
          contentStyle={{ width: '100%', maxWidth: 'none' }}
        >
          <Search />
        </Dialog>
      </span>
    );
  }
}

SearchModal.propTypes = {};
