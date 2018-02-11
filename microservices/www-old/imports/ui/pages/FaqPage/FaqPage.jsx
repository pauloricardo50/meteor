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

const FaqPage = () => (
  <section style={styles.section} className="animated fadeIn">
    <article style={styles.article}>
      <h1>
        <T id="FaqPage.title" />
      </h1>

      <div className="description" style={styles.description}>
        <p>
          <T id="FaqPage.description" />
        </p>
      </div>
    </article>
  </section>
);

FaqPage.propTypes = {};

export default FaqPage;
