import React from 'react';
import { T } from 'core/components/Translation';

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

const AboutPage = () => (
  <section style={styles.section} className="animated fadeIn">
    <article style={styles.article}>
      <h1>
        <T id="AboutPage.title" />
      </h1>

      <div className="description" style={styles.description}>
        <p>
          <T id="AboutPage.description" />
        </p>
      </div>
    </article>
  </section>
);

export default AboutPage;
