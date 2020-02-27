import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import Button from 'core/components/Button';
import T from 'core/components/Translation';
import { logError } from 'core/api/slack/methodDefinitions';
import Link from '../Link';

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
    logError.run({
      error: { name: 'NotFound page triggered' },
      url:
        window && window.location && window.location.href
          ? window.location.href
          : '',
    });
  }

  render() {
    console.log('NOTFOUND???');
    const { to } = this.props;
    return (
      <section id="not-found-page" style={styles.section}>
        <Helmet>
          <meta name="prerender-status-code" content="404" />
        </Helmet>
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
