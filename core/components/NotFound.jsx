import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'core/components/Button';
import { Link } from 'react-router-dom';

import { T } from 'core/components/Translation';
import track from 'core/utils/analytics';

const styles = {
  section: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  h1: {
    marginBottom: 0,
  },
  button: {
    marginTop: 40,
  },
};

export default class NotFound extends Component {
  componentDidMount() {
    track('NotFound - 404');
  }

  render() {
    return (
      <section style={styles.section}>
        <h1 style={styles.h1}>
          <T id="NotFound.title" />
        </h1>
        <h3 className="secondary">
          <T id="NotFound.description" />
        </h3>
        <div style={styles.button}>
          <Button
            raised
            primary
            label={<T id="NotFound.button" />}
            component={Link}
            link
            to="/home"
          />
        </div>
      </section>
    );
  }
}

NotFound.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};
