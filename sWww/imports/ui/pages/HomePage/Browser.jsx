import React from 'react';

import { T } from 'core/components/Translation';

const Browser = () => (
  <div className="feature1">
    <div className="container-sml">
      <div className="col-12 text-center">
        <h3 className="heading">
          <T id="HomePage.webapp.title" />
        </h3>
        <p className="paragraph">
          <T id="HomePage.webapp.description" />
        </p>
      </div>
    </div>
    <div className="container-lrg centerdevices col-12">
      <div className="browserwrapper">
        <div className="browser">
          <div className="mask">
            <img
              className="mask-img"
              src="img/webapp.png"
              alt="e-Potek browser demo"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

Browser.propTypes = {};

export default Browser;
