import React from 'react';
import PropTypes from 'prop-types';

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

const CareersPage = () => (
  <section style={styles.section} className="animated fadeIn">
    <article style={styles.article}>
      <h1>
        <T id="CareersPage.title" />
      </h1>

      <div className="description" style={styles.description}>
        <p>
          <T
            id="CareersPage.description"
            values={{
              email: (
                <a href="mailto:jobs@e-potek.ch?subject=Je%20veux%20révolutionner%20la%20finance">
                  jobs@e-potek.ch
                </a>
              ),
            }}
          />
        </p>
      </div>
    </article>
  </section>
);

CareersPage.propTypes = {};
