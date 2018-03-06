import React from 'react';

import { Link } from 'react-router-dom';
import { T } from 'core/components/Translation';

const KeyPoints2 = () => (
  <div className="feature2">
    <div className="container-lrg flex-launch">
      <Link className="col-6 link" to="/faq">
        <b className="emoji">
          <span className="fa fa-money" />
        </b>
        <h3 className="subheading">
          <T id="HomePage.sellingpoint5.title" />
        </h3>
        <p className="paragraph">
          <T id="HomePage.sellingpoint5.text" />
        </p>
      </Link>
      <Link className="col-6 link" to="/faq">
        <b className="emoji">
          <span className="fa fa-lock" />
        </b>
        <h3 className="subheading">
          <T id="HomePage.sellingpoint6.title" />
        </h3>
        <p className="paragraph">
          <T id="HomePage.sellingpoint6.text" />
        </p>
      </Link>
    </div>
  </div>
);

KeyPoints2.propTypes = {};

export default KeyPoints2;
