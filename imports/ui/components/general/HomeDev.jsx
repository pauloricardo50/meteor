import React, { PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

export default class HomeDev extends React.Component {
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
      <FlatButton label="Ok" primary onTouchTap={this.handleClose} />,
    ];

    return (
      <span>
        <RaisedButton
          label="Refinancer un bien"
          onTouchTap={this.handleOpen}
          {...this.props}
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
            <RaisedButton
              label="M'avertir par e-mail"
              primary
              href="http://eepurl.com/cKvR45"
            />
          </div>
        </Dialog>
      </span>
    );
  }
}
