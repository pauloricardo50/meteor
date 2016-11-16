import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';


const styles = {
  help: {
    padding: 10,
  },
};

export default class Line8aHelp extends React.Component {
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
        <a onTouchTap={this.handleOpen} style={styles.help}>Comment choisir?</a>
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
