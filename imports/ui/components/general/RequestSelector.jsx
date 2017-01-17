import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';


import { updateValues } from '/imports/api/loanrequests/methods.js';


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
      this.props.loanRequests.forEach((request, index2, array) => {
        if (index2 === value) {
          // If selected value is iterated over in the forEach loop, set to active
          this.updateValue({ active: true }, request._id, index2 + 1 === array.length);
        } else {
          // Else, set active to false
          this.updateValue({ active: false }, request._id, index2 + 1 === array.length);
        }
      });
    }

    // Finally, update the SelectField
    this.setState({ value });
  }

  updateValue(object, id, lastCall) {
    updateValues.call({
      object, id,
    }, (error, result) => {
      if (error) {
        throw new Meteor.Error(500, error.message);
      } else {
        if (lastCall) {
          // Refresh the page so that all subscriptions and active components are properly updated
          // Only do this on the last call of this function
          location.reload()
        }
        return 'Update Successful';
      }
    });
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
            <MenuItem value={index} key={index} primaryText={loanRequest.property.address1} />,
          )}

          {/* Don't allow more than 3 requests at a time */}
          {this.props.loanRequests.length <= 3 && <Divider />}
          {this.props.loanRequests.length <= 3 &&
            <MenuItem value="new" primaryText="Nouvelle Requête" />}

        </SelectField>
      );
    }
    return null;
  }
}

RequestSelector.propTypes = {
  loanRequests: PropTypes.arrayOf(PropTypes.object),
};
