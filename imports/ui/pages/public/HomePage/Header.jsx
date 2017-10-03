import React from 'react';
import Scroll from 'react-scroll';

import { T } from '/imports/ui/components/general/Translation';
import IconButton from '/imports/ui/components/general/IconButton';

import Buttons from './Buttons';
import Devices from './Devices';

const Header = () => (
  <header className="header">
    <div className="container-sml text-center">
      <div className="col-12">
        <h1 className="heading animated fadeInDown thin">
          <T id="HomePage.tagline1" />
          <hr />
          <T id="HomePage.tagline2" />
        </h1>
      </div>
    </div>
    <div className="container-lrg flex-launch">
      <div className="col-6 centervertical animated fadeInLeft">
        <h2 className="desc">
          <T id="HomePage.description" />
        </h2>
        <Buttons />
      </div>
      <Devices />
    </div>
    <div className="scroll-button">
      <IconButton
        type="down"
        onClick={() => {
          Scroll.scroller.scrollTo('descriptions', {
            duration: 500,
            delay: 200,
            smooth: true,
            ignoreCancelEvents: true,
          });
        }}
        style={{ width: 72, height: 72 }}
        iconStyle={{ width: 36, height: 48 }}
      />
    </div>
  </header>
);

Header.propTypes = {};

export default Header;
