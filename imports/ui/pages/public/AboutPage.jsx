import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { T } from '/imports/ui/components/general/Translation.jsx';

const styles = {
  section: {
    display: 'table',
    width: '100%',
    minHeight: '100%',
    padding: 20,
  },
  article: {
    display: 'table-cell',
    width: '100%',
    verticalAlign: 'middle',
    textAlign: 'center',
  },
  description: {
    textAlign: 'unset',
  },
};

const AboutPage = props => (
  <section style={styles.section} className="animated fadeIn">
    <article style={styles.article}>
      <h1>
        <T id="AboutPage.title" />
      </h1>

      <div className="description" style={styles.description}>
        <p>
          <T id="AboutPage.description1" />
          <br />
          <br />
          <T id="AboutPage.description2" />
        </p>
      </div>
    </article>
  </section>
);

AboutPage.propTypes = {};

export default AboutPage;
