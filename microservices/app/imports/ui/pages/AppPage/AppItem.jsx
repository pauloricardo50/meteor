import React from 'react';
import PropTypes from 'prop-types';

import { Link, withRouter } from 'react-router-dom';

const styles = {
  a: {
    marginBottom: 32,
    width: '100%',
    maxWidth: 600,
  },
  title: {
    marginTop: 0,
  },
  subtitle: {
    marginTop: 0,
  },
};

const AppItem = ({ title, subtitle, mainText, href, onClick, history }) => (
  <a
    className="mask1 hover-primary flex-col"
    style={styles.a}
    onClick={() => {
      if (href) {
        history.push(href);
      } else {
        onClick();
      }
    }}
  >
    <h3 style={styles.title}>{title}</h3>
    <h4 className="secondary" style={styles.subtitle}>
      {subtitle}
    </h4>

    <h1
      style={{ alignSelf: 'center', margin: '40px 0' }}
      className="text-center"
    >
      {mainText}
    </h1>
  </a>
);

AppItem.propTypes = {
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
  mainText: PropTypes.node.isRequired,
  href: PropTypes.string,
};

AppItem.defaultProps = {
  subtitle: '',
  href: '',
};

export default withRouter(AppItem);
