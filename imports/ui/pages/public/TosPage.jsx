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

export default class TosPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section style={styles.section} className="animated fadeIn">
        <article style={styles.article}>
          <h1>Termes et Conditions</h1>

          <div className="description" style={styles.description}>
            <p>
              &lt;En développement /&gt;
            </p>
          </div>
        </article>
      </section>
    );
  }
}

TosPage.propTypes = {
};
