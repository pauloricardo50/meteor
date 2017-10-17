import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { T } from '/imports/ui/components/general/Translation';
import ProcessPage from '/imports/ui/components/general/ProcessPage';
import Info from './Info';
import Finance from './Finance';
import Files from './Files';
import Header from './Header';

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
    return (
      <ProcessPage {...this.props} stepNb={1} id={this.state.tab}>
        <section className="mask1 borrower-page">
          <Header {...this.props} />

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
