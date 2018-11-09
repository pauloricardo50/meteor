import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from 'core/components/Button';
import T from 'core/components/Translation';
import SlackService from 'core/api/slack/SlackService';
import Link from './Link';

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
    SlackService.sendError({ error: { name: 'NotFound page triggered' } });
  }

  render() {
    const { to } = this.props;
    return (
      <section id="not-found-page" style={styles.section}>
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
            to={to}
          />
        </div>
      </section>
    );
  }
}

NotFound.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  to: PropTypes.string,
};

NotFound.defaultProps = {
  to: '/',
};
