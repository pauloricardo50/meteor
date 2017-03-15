import React, { Component, PropTypes } from 'react';

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

export default class CareersPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section style={styles.section} className="animated fadeIn">
        <article style={styles.article}>
          <h1>Travailler à e-Potek</h1>

          <div className="description" style={styles.description}>
            <p>
              Nous ne cherchons pas activement de nouveaux candidats en ce moment. Cependant,
              nous sommes toujours ouverts aux candidatures spontanées, écris-nous à
              &nbsp;
              <a
                href="mailto:jobs@e-potek.ch?subject=Je%20veux%20révolutionner%20la%20finance"
              >
                jobs@e-potek.ch
              </a>
              .
            </p>
          </div>
        </article>
      </section>
    );
  }
}

CareersPage.propTypes = {};
