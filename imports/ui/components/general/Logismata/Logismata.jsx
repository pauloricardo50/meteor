import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { LoadingComponent } from '../Loading';
import { getLogismataToken } from '/imports/js/helpers/logismata/methods';

export default class Logismata extends Component {
  constructor(props) {
    super(props);

    this.state = { authToken: '' };
  }

  componentDidMount() {
    getLogismataToken
      .callPromise()
      .then(token => this.setState({ authToken: token }));
  }

  render() {
    const { authToken } = this.state;
    const children = React.Children.map(this.props.children, child =>
      React.cloneElement(child, { logismataToken: authToken }),
    );

    return (
      <div>
        {authToken ? (
          children
        ) : (
          <div style={{ height: 100 }}>
            <LoadingComponent />
          </div>
        )}
      </div>
    );
  }
}

Logismata.propTypes = {};
