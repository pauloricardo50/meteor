import React, { Component } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import Info from './borrowerPage/Info.jsx';
import Finance from './borrowerPage/Finance.jsx';
import Files from './borrowerPage/Files.jsx';

const styles = {
  div: {
    display: 'flex',
    flexDirection: 'column',
  },
  topButton: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  link: {
    margin: '20px 8px',
  },
};

const Header = ({ borrower }) => (
  <header className="text-center">
    <span className="fa fa-user-circle-o fa-5x" />
    <h1>
      {borrower.firstName || "Fiche d'Emprunteur"}
    </h1>
    <h3 className="secondary">{`${borrower.age} ans` || ''}</h3>
  </header>
);

const Links = ({ handleClick, tab }) => (
  <div className="borrower-links text-center">
    <a
      onTouchTap={() => handleClick('personal')}
      className={tab === 'personal' && 'active'}
    >
      <span className="fa fa-user" />
      <h4>Perso</h4>
    </a>
    <a
      onTouchTap={() => handleClick('finance')}
      className={tab === 'finance' && 'active'}
    >
      <span className="fa fa-money" />
      <h4>Finances</h4>
    </a>
    <a
      onTouchTap={() => handleClick('files')}
      className={tab === 'files' && 'active'}
    >
      <span className="fa fa-files-o" />
      <h4>Documents</h4>
    </a>
  </div>
);

export default class BorrowerPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: queryString.parse(props.location.search).tab || 'personal',
    };
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
        return null;
    }
  }

  render() {
    const borrowerId = this.props.match.params.borrowerId;
    const borrower = this.props.borrowers.find(b => b._id === borrowerId);

    return (
      <div style={styles.div}>
        <RaisedButton
          label="Retour"
          containerElement={<Link to="/app" />}
          style={styles.topButton}
        />

        <section className="mask1 borrower-page">
          <Header borrower={borrower} />
          <Links
            {...this.props}
            tab={this.state.tab}
            handleClick={tab => this.setState({ tab })}
          />

          {this.getContent()}
        </section>
      </div>
    );
  }
}

BorrowerPage.propTypes = {
  // loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};
