import React, { Component, PropTypes } from 'react';


import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';


const styles = {
  help: {
    padding: 10,
  },
};

export default class Line7aHelp2 extends Component {
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
        primary
        onTouchTap={this.handleClose}
      />,
    ];

    return (
      <span>
        <FlatButton
          onTouchTap={this.handleOpen}
          style={this.props.buttonStyle}
          label="Je n'ai pas assez"
          primary
          icon={<FontIcon className="fa fa-question" />}
        />
        <Dialog
          title="Manque de fonds propres"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          e-Potek paie la tournée, pas de problème.
        </Dialog>
      </span>
    );
  }
}

Line7aHelp2.propTypes = {
  buttonStyle: PropTypes.objectOf(PropTypes.any).isRequired,
};
