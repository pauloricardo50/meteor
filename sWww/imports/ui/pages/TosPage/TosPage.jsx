import React from 'react';

import { T } from '/imports/ui/components/general/Translation';

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

const TosPage = () => (
  <section style={styles.section} className="animated fadeIn">
    <article style={styles.article}>
      <h1>
        <T id="TosPage.title" />
      </h1>

      <div className="description" style={styles.description}>
        <p>
          <T id="TosPage.description" />
        </p>
      </div>
    </article>
  </section>
);

TosPage.propTypes = {};

export default TosPage;
