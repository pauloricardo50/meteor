import React, { Component } from 'react';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';

import { T } from '/imports/ui/components/general/Translation.jsx';
import Comparator from './comparePage/Comparator.jsx';

const styles = {
  initial: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '100px 0',
  },
};

export default class ComparePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { properties } = this.props;
    if (properties.length <= 0) {
      return (
        <section style={styles.initial}>
          <RaisedButton primary label={<T id="ComparePage.CTA" />} />
        </section>
      );
    }

    return <Comparator {...this.props} />;
  }
}

ComparePage.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.object),
};

ComparePage.defaultProps = {
  properties: [{}],
};
