import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class NewRequestpage extends Component {
  componentDidMount() {
    if (this.props.borrowers.length <= 0) {
      // If there are no borrowers, head to start2 form to go through whole process
      this.props.history.push(`/start2/acquisition${this.props.location.search}`);
    }
  }

  render() {
    return (
      <section>
        <h1>Nouvelle demande de prêt</h1>

        {/* <BorrowerSelector borrowers={this.props.borrowers} /> */}

        {/* <AutoStart /> */}
      </section>
    );
  }
}

NewRequestpage.propTypes = {
  borrowers: PropTypes.arrayOf(PropTypes.object),
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

NewRequestpage.defaultProps = {
  borrowers: [],
};
