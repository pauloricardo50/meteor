import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ProcessPage from '../../components/ProcessPage';
import Info from './Info';
import Finance from './Finance';
import Files from './Files';
import BorrowerHeader from './BorrowerHeader';
import Tabs from './Tabs';

export default class BorrowerPage extends Component {
  constructor(props) {
    super(props);

    const tab = this.props.match.params.tab || 'personal';
    this.state = { tab };
  }

  componentWillReceiveProps(nextProps) {
    const tab = nextProps.match.params.tab;

    if (tab !== this.state.tab) {
      this.setState({ tab });
    }
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

  render() {
    const { loan, borrowers } = this.props;
    const sectionClasses = classNames('mask1 borrower-page', {
      'p-t--109': borrowers.length > 1,
      'p-t--159': borrowers.length === 1,
    });

    return (
      <ProcessPage {...this.props} stepNb={1} id="borrowers">
        <section className={sectionClasses}>
          <Tabs loan={loan} borrowers={borrowers} />

          <BorrowerHeader {...this.props} />

          {this.getContent()}
        </section>
      </ProcessPage>
    );
  }
}

BorrowerPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};
