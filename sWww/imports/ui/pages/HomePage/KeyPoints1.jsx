import React from 'react';

import Scroll from 'react-scroll';
import { T } from 'core/components/Translation';

const KeyPoints1 = props => (
  <Scroll.Element name="descriptions" className="feature3 animated fadeInUp">
    <div className="container-lrg flex-launch">
      <div className="col-12">
        <b className="emoji">
          <span className="fa fa-calculator" />
        </b>
        <h3 className="subheading">
          <T id="HomePage.sellingpoint1.title" />
        </h3>
        <p className="paragraph">
          <T id="HomePage.sellingpoint1.text" />
        </p>
      </div>
      <div className="col-12">
        <b className="emoji">
          <span className="fa fa-gavel" />
        </b>
        <h3 className="subheading">
          <T id="HomePage.sellingpoint2.title" />
        </h3>
        <p className="paragraph">
          <T id="HomePage.sellingpoint2.text" />
        </p>
      </div>
      <div className="col-12">
        <b className="emoji">
          <span className="fa fa-laptop" />
        </b>
        <h3 className="subheading">
          <T id="HomePage.sellingpoint3.title" />
        </h3>
        <p className="paragraph">
          <T id="HomePage.sellingpoint3.text" />
        </p>
      </div>
      <div className="col-12">
        <b className="emoji">
          <span className="fa fa-check" />
        </b>
        <h3 className="subheading">
          <T id="HomePage.sellingpoint4.title" />
        </h3>
        <p className="paragraph">
          <T id="HomePage.sellingpoint4.text" />
        </p>
      </div>
    </div>
  </Scroll.Element>
);

KeyPoints1.propTypes = {};

export default KeyPoints1;
