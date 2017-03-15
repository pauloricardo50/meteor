import React, { Component, PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

import NewPartnerForm from '/imports/ui/components/admin/NewPartnerForm.jsx';

export default class AdminActionsPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const action = FlowRouter.getParam('action');
    let content;

    switch (action) {
      case 'client':
        content = null;
        break;
      case 'newpartner':
        content = <NewPartnerForm />;
        break;
      default:
        content = null;
        break;
    }

    return (
      <section className="mask1">
        {content}
      </section>
    );
  }
}

AdminActionsPage.propTypes = {};
