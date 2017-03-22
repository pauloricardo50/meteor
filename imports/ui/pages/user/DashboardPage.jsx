import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';

import NewUserOptions from '/imports/ui/components/general/NewUserOptions.jsx';
import DashboardItem from './dashboardPage/DashboardItem.jsx';

export default class DashboardPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: 0,
    };
  }

  handleClick(i) {
    if (this.state.active === i) {
      this.setState({ active: -1 });
    } else {
      this.setState({ active: i });
    }
  }

  render() {
    const sortedRequests = this.props.loanRequests.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    if (this.props.loanRequests.length <= 0) {
      return <NewUserOptions />;
    }

    return (
      <section>
        <h1>Votre Dashboard e-Potek</h1>

        {sortedRequests.map((request, i) => (
          <DashboardItem
            loanRequest={request}
            key={request._id}
            handleClick={() => this.handleClick(i)}
            active={this.state.active === i}
            multiple={this.props.loanRequests.length > 1}
          />
        ))}

        <Link className="mask2 add-request" to="/start">
          <h1>+</h1><h4>Nouvelle demande</h4>
        </Link>
      </section>
    );
  }
}

DashboardPage.defaultProps = {
  loanRequests: [],
};

DashboardPage.propTypes = {
  loanRequests: PropTypes.arrayOf(PropTypes.object),
};
