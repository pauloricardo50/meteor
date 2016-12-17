import React, { Component, PropTypes } from 'react';

export default class RequestDetails extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <article>
        <div className="col-xs-12 col-sm-6 col-lg-4">
          <h3>Projet</h3>
        </div>
        <div className="col-xs-12 col-sm-6 col-lg-4">
          <h3>Informations Personelles</h3>
        </div>
        <div className="col-xs-12 col-sm-6 col-lg-4">
          <h3>Finances</h3>
        </div>
      </article>
    );
  }
}

RequestDetails.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
