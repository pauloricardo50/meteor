import React from 'react';

const ContactPage = () => (
  <section className="mask1">
    <h1>Contact</h1>
    <hr />

    <div className="content">
      <div className="form-group">
        <h4>Par Téléphone <small>Lu-Ve 8h-19h</small></h4>
        <a href="tel:+41 78 709 31 31">+41 78 709 31 31</a>
      </div>

      <div className="form-group">
        <h4>Par Email</h4>
        <a href="mailto:contact@e-potek.ch">contact@e-potek.ch</a>
      </div>
    </div>
  </section>
);

ContactPage.propTypes = {};

export default ContactPage;
