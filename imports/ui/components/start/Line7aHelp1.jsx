import React, { Component, PropTypes } from 'react';


import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';


const styles = {
  help: {
    padding: 10,
  },
};

export default class Line7aHelp1 extends Component {
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
          label="Pourquoi ?"
          primary
          icon={<FontIcon className="fa fa-question" />}
        />
        <Dialog
          title="Méthode de Calcul"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          Je ne suis pas sûr...
        </Dialog>
      </span>
    );
  }
}

Line7aHelp1.propTypes = {
  buttonStyle: PropTypes.objectOf(PropTypes.any).isRequired,
};
