import React, { PropTypes } from 'react';
import { DocHead } from 'meteor/kadira:dochead';


const style = {
  content: {
    paddingLeft: 20,
    paddingRight: 20,
  },
};


export default class ContactPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    DocHead.setTitle('Nous Contacter - e-Potek');
  }

  render() {
    return (
      <section className="mask1 animated fadeIn">
        <h2>Contact</h2>
        <hr />

        <div className="content">
          <div className="form-group">
            <h4>Par Téléphone <small>Lu-Ve 8h-19h</small></h4>
            <a href="tel:+41 78 709 31 31">+41 78 709 31 31</a>
          </div>

          <div className="form-group">
            <h4>Par Email</h4>
            <p>contact@e-potek.ch</p>
          </div>
        </div>
      </section>
    );
  }
}

ContactPage.propTypes = {
};
