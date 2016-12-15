import React, { Component, PropTypes } from 'react';


const styles = {
  section: {
    height: 500,
  },
};

export default class PartnerHomePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section className="mask1" style={styles.section}>
        <h1>Aperçu Global</h1>
        <p>Voici plus de text</p>
      </section>
    );
  }
}

PartnerHomePage.propTypes = {
};
