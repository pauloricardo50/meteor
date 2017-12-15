import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Dialog from 'core/components/Material/Dialog';
import Button from '/imports/ui/components/general/Button';

import { T } from 'core/components/Translation';
import track from '/imports/js/helpers/analytics';

export default class HomeDev extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  handleOpen = () => {
    this.props.handleClick();
    this.setState({ open: true });
  };

  render() {
    const actions = [
      <Button key="ok" label="Ok" primary onClick={this.handleClose} />,
    ];

    return (
      <span>
        <Button
          raised
          label={<T id="HomePage.CTA2" />}
          onClick={this.handleOpen}
          primary={this.props.primary}
          style={this.props.style}
          id="refinancing"
        />
        <Dialog
          title={<T id="HomeDev.title" />}
          actions={actions}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <T id="HomeDev.description" />
          <div className="text-center" style={{ marginTop: 20 }}>
            <Button
              raised
              label={<T id="HomeDev.CTA" />}
              primary
              href="http://eepurl.com/cKvR45"
              onClick={() => {
                track('HomeDev - clicked on CTA', {});
              }}
            />
          </div>
        </Dialog>
      </span>
    );
  }
}

HomeDev.propTypes = {
  handleClick: PropTypes.func,
  primary: PropTypes.bool,
};

HomeDev.defaultProps = {
  handleClick: () => null,
  primary: false,
};
