import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { LoadingComponent } from '../Loading';
import { getLogismataToken } from '/imports/js/helpers/logismata/methods';

export default class Logismata extends Component {
  constructor(props) {
    super(props);

    this.state = { authToken: '', error: '' };
  }

  componentDidMount() {
    getLogismataToken
      .callPromise()
      .then(token => this.setState({ authToken: token }))
      .catch((e) => {
        this.setState({ error: e.message });
      });
  }

  render() {
    const { authToken, error } = this.state;
    const children = React.Children.map(this.props.children, child =>
      React.cloneElement(child, { logismataToken: authToken }),
    );

    if (error) {
      return <div>{error}</div>;
    }

    console.log(authToken);

    return (
      <div>
        {authToken ? (
          <div>hi</div> // children
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
