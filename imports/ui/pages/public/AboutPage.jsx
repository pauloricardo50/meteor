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

export default class AboutPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section style={styles.section} className="animated fadeIn">
        <article style={styles.article}>
          <h1>Le prêt hypothécaire de demain</h1>

          <div className="description" style={styles.description}>
            <p>
              e-Potek vous permet de facilement trouver un prêt hypothécaire dans le canton de Genève.
              Expansion prévue prochainement.
              <br /><br />
              L'équipe derrière e-Potek est composée d'entrepreneurs vétérans avec une
              expérience cumulée de plus de 30 ans dans la finance et les
              prêts hypothécaires en Suisse.
            </p>
          </div>
        </article>
      </section>
    );
  }
}

AboutPage.propTypes = {};
