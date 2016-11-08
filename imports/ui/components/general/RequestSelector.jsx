import React, { Component, PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import CreditRequests from '/imports/api/creditrequests/creditrequests.js';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class RequestSelector extends Component {
  constructor(props) {
    super(props);

    // Set the active MenuItem to be the active CreditRequest, there should only be one
    this.props.creditRequests.forEach((request, index1) => {
      if (request.active === true) {
        this.state = {
          value: index1,
        };
      }
    });

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, index, value) {
    if (value === 'new') {
      FlowRouter.go('/new');
    } else {
      // Update the database to set the active request
      this.props.creditRequests.forEach((request, index2) => {
        if (index2 === value) {
          // If selected value is iterated over in the forEach loop, set to active
          CreditRequests.update(request._id, { $set: { active: true } });
        } else {
          // Else, set active to false
          CreditRequests.update(request._id, { $set: { active: false } });
        }
      });
    }

    // Finally, update the SelectField
    this.setState({ value });

    // Refresh the page so that all subscriptions are properly updated
    location.reload();
  }

  render() {
    if (this.props.creditRequests.length) {
      return (
        <SelectField
          floatingLabelText="Requête Active"
          value={this.state.value}
          onChange={this.handleChange}
        >
          {this.props.creditRequests.map((creditRequest, index) =>
            <MenuItem value={index} key={index} primaryText={creditRequest.requestName} />
          )}
          <MenuItem value="new" primaryText="Nouvelle Requête" />
        </SelectField>
      );
    }
    return null;
  }
}

RequestSelector.propTypes = {
  creditRequests: PropTypes.arrayOf(PropTypes.object),
};
