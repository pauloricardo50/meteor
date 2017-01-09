import React, {PropTypes} from 'react';

import { toMoney } from '/imports/js/finance-math';

export default class AdminSingleRequestPage extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <section className="mask1">
        <h1>
          {this.props.loanRequest.property.address1} - CHF&nbsp;
          {toMoney(this.props.loanRequest.property.value)}
        </h1>
      </section>
    );
  }
}

AdminSingleRequestPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
};
