import React, { Component } from 'react';

import PropTypes from 'prop-types';
import queryString from 'query-string';
import { Link } from 'react-router-dom';

import ProcessPage from '/imports/ui/components/general/ProcessPage.jsx';
import Info from './borrowerPage/Info.jsx';
import Finance from './borrowerPage/Finance.jsx';
import Files from './borrowerPage/Files.jsx';
import Header from './borrowerPage/Header.jsx';

const styles = {
  div: {
    display: 'flex',
    flexDirection: 'column',
  },
  topButton: {
    marginBottom: 20,
    alignSelf: 'flex-end',
  },
  bottomButton: {
    marginTop: 20,
    alignSelf: 'flex-end',
  },
  link: {
    margin: '20px 8px',
  },
};

const Links = props => (
  <div className="borrower-links text-center">
    <Link
      to={`/app/requests/${props.requestId}/borrowers/${props.borrower._id}/personal`}
      className={props.tab === 'personal' && 'active'}
    >
      <span className="fa fa-user" />
      <h4>Perso</h4>
    </Link>
    <Link
      to={`/app/requests/${props.requestId}/borrowers/${props.borrower._id}/finance`}
      className={props.tab === 'finance' && 'active'}
    >
      <span className="fa fa-money" />
      <h4>Finances</h4>
    </Link>
    <Link
      to={`/app/requests/${props.requestId}/borrowers/${props.borrower._id}/files`}
      className={props.tab === 'files' && 'active'}
    >
      <span className="fa fa-files-o" />
      <h4>Documents</h4>
    </Link>
  </div>
);

export default class BorrowerPage extends Component {
  constructor(props) {
    super(props);

    const tab = this.props.match.params.tab || 'personal';
    this.state = { tab };
  }

  getContent() {
    switch (this.state.tab) {
      case 'personal':
        return <Info {...this.props} />;
      case 'finance':
        return <Finance {...this.props} />;
      case 'files': {
        const borrowerId = this.props.match.params.borrowerId;
        const borrower = this.props.borrowers.find(b => b._id === borrowerId);
        return <Files {...this.props} borrower={borrower} />;
      }
      default:
        return <Info {...this.props} />;
    }
  }

  componentWillReceiveProps(nextProps) {
    const tab = nextProps.match.params.tab;

    if (tab !== this.state.tab) {
      this.setState({ tab });
    }
  }

  render() {
    const borrowerId = this.props.match.params.borrowerId;
    const requestId = this.props.match.params.requestId;
    const borrower = this.props.borrowers.find(b => b._id === borrowerId);
    const index = this.props.borrowers.indexOf(borrower);

    return (
      <ProcessPage {...this.props} stepNb={1} id={this.state.tab}>
        <section className="mask1 borrower-page">
          <Header borrower={borrower} {...this.props} index={index} />
          <Links borrower={borrower} {...this.props} tab={this.state.tab} requestId={requestId} />

          {this.getContent()}
        </section>
      </ProcessPage>
    );
  }
}

BorrowerPage.propTypes = {
  // loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};
