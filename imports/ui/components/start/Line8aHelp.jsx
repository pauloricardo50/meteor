import React, { Component, PropTypes } from 'react';


import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';


const styles = {
  help: {
    padding: 10,
  },
};

export default class Line8aHelp extends Component {
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
          label="Aidez-moi à choisir"
          primary
          icon={<FontIcon className="fa fa-question" />}
        />
        <Dialog
          title="2ème pilier ou fortune?"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          La LPP c'est de la bombe!
        </Dialog>
      </span>
    );
  }
}

Line8aHelp.propTypes = {
  buttonStyle: PropTypes.objectOf(PropTypes.any).isRequired,
};
