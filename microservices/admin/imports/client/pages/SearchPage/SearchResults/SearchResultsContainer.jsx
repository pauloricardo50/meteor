import { withQuery } from 'meteor/cultofcoders:grapher-react';

import React, { Component } from 'react';
import { compose } from 'recompose';

import query from 'core/api/resolvers/searchDatabase';

export default compose(
  withQuery(({ searchQuery }) => query.clone({ searchQuery })),
  MyComponent =>
    class extends Component {
      constructor(props) {
        super(props);
        this.state = {};
      }

      static getDerivedStateFromProps(props, state) {
        const { data } = props;

        // Cache results on the client to make sure we're displaying the correct
        // results, and not the ones that took the longest to arrive to the
        // client
        if (data && data.searchQuery && !state[data.searchQuery]) {
          const { searchQuery, ...realData } = data;
          return { [data.searchQuery]: realData };
        }

        return null;
      }

      render() {
        const { searchQuery } = this.props;
        return (
          <MyComponent {...this.props} results={this.state[searchQuery]} />
        );
      }
    },
);
