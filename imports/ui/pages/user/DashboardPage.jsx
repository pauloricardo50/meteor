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

    this.handleClick = this.handleClick.bind(this);
    this.handleNew = this.handleNew.bind(this);
  }

  handleClick(i) {
    if (this.state.active === i) {
      this.setState({ active: -1 });
    } else {
      this.setState({ active: i });
    }
  }

  handleNew() {
    if (this.props.borrowers.length > 0) {
      // TODO, add a new request page for logged in users
      console.log('En développement');
    } else {
      this.props.history.push('/');
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
            borrowers={this.props.borrowers}
            key={request._id}
            handleClick={() => this.handleClick(i)}
            active={this.state.active === i}
            multiple={this.props.loanRequests.length > 1}
          />
        ))}

        {/* <div className="text-center">
          <a className="mask2 new-request" onClick={this.handleNew}>
            <h1>+</h1><h4 className="bold">Nouvelle demande</h4>
          </a>
        </div> */}
      </section>
    );
  }
}

DashboardPage.defaultProps = {
  loanRequests: [],
  borrowers: [],
};

DashboardPage.propTypes = {
  loanRequests: PropTypes.arrayOf(PropTypes.object),
  borrowers: PropTypes.arrayOf(PropTypes.object),
};
