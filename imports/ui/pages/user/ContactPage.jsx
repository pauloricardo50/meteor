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
      <section className="mask1">
        <h2>Contact</h2>
        <hr />

        <div className="content">
          <div className="form-group">
            <h4>Par Téléphone</h4>
            <p>+41 21 210 10 10</p>
          </div>

          <div className="form-group">
            <h4>Par Email</h4>
            <p>help@e-potek.ch</p>
          </div>
        </div>
      </section>
    );
  }
}

ContactPage.propTypes = {
};
