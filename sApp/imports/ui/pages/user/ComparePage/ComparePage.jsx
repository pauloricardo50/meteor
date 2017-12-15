import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '/imports/ui/components/general/Button';

import { T } from 'core/components/Translation';
import Comparator from './Comparator';
import GoogleMapContainer from '/imports/ui/components/general/GoogleMapContainer';
import cleanMethod from '/imports/api/cleanMethods';

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

  handleStart = () => {
    cleanMethod('insertComparator');
  };

  render() {
    const { properties, comparator } = this.props;

    if (!comparator) {
      return (
        <section style={styles.initial}>
          <Button
            raised
            primary
            label={<T id="ComparePage.start" />}
            onClick={this.handleStart}
          />
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
  comparator: PropTypes.objectOf(PropTypes.any),
};

ComparePage.defaultProps = {
  properties: [],
  comparator: undefined,
};
