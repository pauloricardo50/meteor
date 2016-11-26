import React, { Component, PropTypes } from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';


const styles = {
  help: {
    padding: 10,
  },
};

export default class Line9aHelp extends Component {
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
          title="L'endettement, bien ou mauvais?"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          En général, nous recommandons de toujours s'endetter au minimum si vous pouvez vous le
          permettre financièrement.
          <br />
          En Suisse, si votre dette est en dessous de 65% de la valeur de la propriété, vous n'avez
          plus besoin de l'amortir, et ne payez donc que des intérêts, ce qui est généralement moins
          cher que l'impôt sur la fortune lorsque toute votre dette est rembourséé.
          <br />
          Yannis, c'est tout ce que je sais ! ;)
        </Dialog>
      </span>
    );
  }
}

Line9aHelp.propTypes = {
  buttonStyle: PropTypes.objectOf(PropTypes.any).isRequired,
};
