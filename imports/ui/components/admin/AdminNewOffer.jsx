import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '/imports/ui/components/general/Material/Dialog';
import Button from '/imports/ui/components/general/Button';

import OfferForm from '/imports/ui/components/admin/OfferForm';

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

    this.state = { open: false };
  }

  handleClose = () => this.setState({ open: false });

  handleOpen = () => this.setState({ open: true });

  render() {
    const actions = [
      <Button label="Annuler" primary onClick={this.handleClose} />,
      // <Button label="Ajouter" primary keyboardFocused onClick={this.handleClose} />,
    ];

    return (
      <div>
        <Button
          raised
          label="Ajouter une offre"
          onClick={this.handleOpen}
          primary
          style={this.props.style}
        />
        <Dialog
          title="Ajouter une offre"
          actions={actions}
          modal
          open={this.state.open}
          onRequestClose={this.handleClose}
          fullScreen
        >
          <OfferForm
            {...this.props}
            method="insertAdminOffer"
            callback={this.handleClose}
            admin
          />
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
