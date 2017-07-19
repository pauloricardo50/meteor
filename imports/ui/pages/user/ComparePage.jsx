import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '/imports/ui/components/general/Button.jsx';

import { T } from '/imports/ui/components/general/Translation.jsx';
import Comparator from './comparePage/Comparator.jsx';

import GoogleMapContainer from '/imports/ui/components/general/GoogleMapContainer.jsx';

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
          <Button raised primary label={<T id="ComparePage.CTA" />} />
        </section>
      );
    }

    return (
      <section style={{ marginLeft: -16, marginRight: -16 }}>
        <GoogleMapContainer>
          <Comparator {...this.props} />
        </GoogleMapContainer>
      </section>
    );
  }
}

ComparePage.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.object),
};

ComparePage.defaultProps = {
  properties: [{}],
};
