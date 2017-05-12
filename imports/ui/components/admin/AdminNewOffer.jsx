import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import OfferForm from '/imports/ui/components/general/OfferForm';

const styles = {
  backDrop: {
    backgroundColor: 'transparent',
    display: 'none',
  },
  dialog: {
    width: '100%',
    maxWidth: '80%',
  },
};

export default class AdminNewOffer extends React.Component {
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
    this.setState({ open: true });
  };

  render() {
    const actions = [
      <FlatButton label="Annuler" primary onTouchTap={this.handleClose} />,
      // <FlatButton label="Ajouter" primary keyboardFocused onTouchTap={this.handleClose} />,
    ];

    return (
      <div>
        <RaisedButton
          label="Ajouter une offre"
          onTouchTap={this.handleOpen}
          primary
          style={this.props.style}
        />
        <Dialog
          title="Ajouter une offre"
          actions={actions}
          modal
          open={this.state.open}
          onRequestClose={this.handleClose}
          overlayStyle={styles.backDrop}
          contentStyle={styles.dialog}
          autoScrollBodyContent
        >
          <OfferForm {...this.props} method="insertAdminOffer" callback={this.handleClose} admin />
        </Dialog>
      </div>
    );
  }
}

AdminNewOffer.propTypes = {
  style: PropTypes.objectOf(PropTypes.any),
};

AdminNewOffer.defaultProps = {
  style: {},
};
