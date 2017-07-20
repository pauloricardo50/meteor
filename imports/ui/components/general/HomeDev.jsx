import PropTypes from 'prop-types';
import React from 'react';
import Dialog from 'material-ui/Dialog';
import Button from '/imports/ui/components/general/Button.jsx';

import { T } from '/imports/ui/components/general/Translation.jsx';
import track from '/imports/js/helpers/analytics';

export default class HomeDev extends React.Component {
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
      <Button label="Ok" primary onTouchTap={this.handleClose} />,
    ];

    return (
      <span>
        <Button
          raised
          label={<T id="HomePage.CTA2" />}
          onTouchTap={this.handleOpen}
          primary={this.props.primary}
          style={this.props.style}
          buttonStyle={this.props.buttonStyle}
          labelStyle={this.props.labelStyle}
          overlayStyle={this.props.overlayStyle}
          id="refinancing"
        />
        <Dialog
          title={
            <h3>
              <T id="HomeDev.title" />
            </h3>
          }
          actions={actions}
          modal={false}
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
              onTouchTap={() => {
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
