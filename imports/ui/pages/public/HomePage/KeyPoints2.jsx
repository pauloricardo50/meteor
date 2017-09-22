import React from 'react';

import { T } from '/imports/ui/components/general/Translation';

const KeyPoints2 = () => (
  <div className="feature2">
    <div className="container-lrg flex-launch">
      <div className="col-6">
        <b className="emoji">
          <span className="fa fa-money" />
        </b>
        <h3 className="subheading">
          <T id="HomePage.sellingpoint5.title" />
        </h3>
        <p className="paragraph">
          <T id="HomePage.sellingpoint5.text" />
        </p>
      </div>
      <div className="col-6">
        <b className="emoji">
          <span className="fa fa-lock" />
        </b>
        <h3 className="subheading">
          <T id="HomePage.sellingpoint6.title" />
        </h3>
        <p className="paragraph">
          <T id="HomePage.sellingpoint6.text" />
        </p>
      </div>
    </div>
  </div>
);

KeyPoints2.propTypes = {};

export default KeyPoints2;
