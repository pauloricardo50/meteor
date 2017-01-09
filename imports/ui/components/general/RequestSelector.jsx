import React, { Component, PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import LoanRequests from '/imports/api/loanrequests/loanrequests.js';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


const styles = {
  field: {
    width: 'unset',
  },
};

export default class RequestSelector extends Component {
  constructor(props) {
    super(props);

    // Set the active MenuItem to be the active LoanRequest, there should only be one
    this.props.loanRequests.forEach((request, index1) => {
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
      FlowRouter.go('/start');
    } else {
      // Update the database to set the active request
      this.props.loanRequests.forEach((request, index2) => {
        if (index2 === value) {
          // If selected value is iterated over in the forEach loop, set to active
          LoanRequests.update(request._id, { $set: { active: true } });
        } else {
          // Else, set active to false
          LoanRequests.update(request._id, { $set: { active: false } });
        }
      });
    }

    // Finally, update the SelectField
    this.setState({ value });

    // Refresh the page so that all subscriptions are properly updated
    location.reload();
  }

  render() {
    if (this.props.loanRequests.length) {
      return (
        <SelectField
          floatingLabelText="Requête Active"
          value={this.state.value}
          onChange={this.handleChange}
          style={styles.field}
        >
          {this.props.loanRequests.map((loanRequest, index) =>
            <MenuItem value={index} key={index} primaryText={loanRequest.property.address1} />
          )}
          <MenuItem value="new" primaryText="Nouvelle Requête" />
        </SelectField>
      );
    }
    return null;
  }
}

RequestSelector.propTypes = {
  loanRequests: PropTypes.arrayOf(PropTypes.object),
};
