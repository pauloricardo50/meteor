import PropTypes from 'prop-types';
import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

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
      <FlatButton
        label="Ok"
        primary
        onTouchTap={this.handleClose}
        style={this.props.style}
        buttonStyle={this.props.buttonStyle}
        labelStyle={this.props.labelStyle}
        overlayStyle={this.props.overlayStyle}
        id="refinancing"
      />,
    ];

    return (
      <span>
        <RaisedButton
          label="Refinancer un bien"
          onTouchTap={this.handleOpen}
          primary={this.props.primary}
        />
        <Dialog
          title="En Développement"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <span>
            Nous allons bientôt ouvrir e-Potek aux refinancements !
          </span>
          <div className="text-center" style={{ marginTop: 20 }}>
            <RaisedButton label="M'avertir par e-mail" primary href="http://eepurl.com/cKvR45" />
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
