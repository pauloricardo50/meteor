import React from 'react';

const styles = {
  content: {
    width: '100%',
    maxWidth: 400,
    margin: '0 auto',
  },
};

const ContactPage = () => (
  <section className="mask1">
    <h1>Contactez Votre Conseiller</h1>
    <hr />

    <div className="text-center">
      <img
        src="/img/yannis.jpg"
        style={{ width: 150, height: 150, borderRadius: '50%' }}
      />
    </div>

    <div className="description">
      <p>
        <span className="active">Yannis</span>
        {' '}
        est votre conseiller e-Potek attitré. Il suivra personellement votre dossier et est à votre disposition à tout instant.
      </p>
    </div>

    <div className="content" style={styles.content}>
      <div className="form-group">
        <h4>Par Téléphone <small>Lu-Ve 8h-19h</small></h4>
        <a href="tel:+41 78 709 31 31">+41 22 346 73 73</a>
      </div>

      <div className="form-group">
        <h4>Par Email</h4>
        <a href="mailto:contact@e-potek.ch">yannis@e-potek.ch</a>
      </div>
    </div>
  </section>
);

ContactPage.propTypes = {};

export default ContactPage;
