// @flow
import { Meteor } from 'meteor/meteor';
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { withTracker } from 'meteor/react-meteor-data';

import { compose, lifecycle, withState } from 'recompose';
import Button from '../Button';

type DisconnectModalProps = {};

const DisconnectModal = ({ open }: DisconnectModalProps) => (
  <Dialog disableBackdropClick disableEscapeKeyDown open={open}>
    <div className="disconnect-modal">
      <h2>Allo, e-Potek?</h2>
      <h4 className="secondary">On a un problème!</h4>
      <p className="description">
        Il semblerait que vous soyiez déconnecté, vous pouvez essayer de vous
        reconnecter en cliquant sur le bouton dessous.
      </p>
      <Button raised primary onClick={() => Meteor.reconnect()}>
        Se reconnecter
      </Button>
    </div>
  </Dialog>
);

export default compose(
  withTracker(() => ({ status: Meteor.status() })),
  withState('open', 'setOpen', false),
  lifecycle({
    componentWillReceiveProps({ status: nextStatus }) {
      const { status, setOpen, open } = this.props;

      if (status.connected && !nextStatus.connected) {
        setOpen(true);
      }

      if (!status.connected && nextStatus.connected) {
        setOpen(false);
      }

      // These last 2 conditions are technically not required, but somehow
      // they were still needed to get the modal to always respond properly
      if (open && status.connected && nextStatus.connected) {
        setOpen(false);
      }

      if (!open && !status.connected && !nextStatus.connected) {
        setOpen(true);
      }
    },
  }),
)(DisconnectModal);
