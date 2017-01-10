import React, { Component, PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

export default class AdminActionsPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const action = FlowRouter.getParam('action');

    switch (action) {
      case 'client':
        return null;
      case 'newPartnerAccount':
        return null;
      default: return null;
    }
  }
}

AdminActionsPage.propTypes = {
};
