import React, { Component, PropTypes } from 'react';


import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';

const styles = {
  button: {
    marginRight: 8,
    marginBottom: 8,
  },
};

export default class HelpModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  render() {
    const actions = [
      <FlatButton
        label="Ok"
        onTouchTap={this.handleClose}
        primary
      />,
    ];

    return (
      <span>
        <RaisedButton
          onTouchTap={this.handleOpen}
          style={styles.button}
          label={this.props.buttonLabel}
          icon={<FontIcon className="fa fa-info" />}
        />
        <Dialog
          title={this.props.title}
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          {this.props.content}
        </Dialog>
      </span>
    );
  }
}

HelpModal.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};
