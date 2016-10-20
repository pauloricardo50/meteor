import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

import Panel from 'react-bootstrap/lib/Panel';

export default class RequestPanel extends React.Component {
  routeTodo() {
    const route = `/${this.props.creditRequest._id}/todo`;
    FlowRouter.go(route);
  }

  render() {
    return (
      <Panel onClick={this.routeTodo.bind(this)} className="request-panel">
        <h5>Demande de Prêt</h5><br />
        <p>Commencée Aujourd'hui</p>
      </Panel>
    );
  }
}
