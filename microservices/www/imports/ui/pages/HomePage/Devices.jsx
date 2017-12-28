import React from 'react';
import PropTypes from 'prop-types';

const Devices = () => (
  <div className="col-6 sidedevices animated fadeInRight">
    <div className="iphoneipad">
      <div className="marvel-iphone iphone">
        {/* <div className="marvel-device iphone-x">
          <div className="notch">
            <div className="camera" />
            <div className="speaker" />
          </div>
          <div className="top-bar" />
          <div className="sleep" />
          <div className="bottom-bar" />
          <div className="volume" />
          <div className="overflow">
            <div className="shadow shadow--tr" />
            <div className="shadow shadow--tl" />
            <div className="shadow shadow--br" />
            <div className="shadow shadow--bl" />
          </div>
          <div className="inner-shadow" />
          <div className="screen">
            <img
              className="mask-img"
              srcSet="/img/mobileapp@1x.png 500w, /img/mobileapp@2x.png 1000w"
              alt="e-Potek Mobile Example"
            />
          </div>
        </div> */}
        <div className="marvel-device iphone8 black">
          <div className="top-bar" />
          <div className="sleep" />
          <div className="volume" />
          <div className="camera" />
          <div className="sensor" />
          <div className="speaker" />
          <div className="screen">
            <img
              className="mask-img"
              srcSet="/img/mobileapp@1x.png 500w, /img/mobileapp@2x.png 1000w"
              alt="e-Potek Mobile Example"
            />
          </div>
          <div className="home" />
          <div className="bottom-bar" />
        </div>
      </div>
      {/* <div className="iphone">
            <div className="mask">
              <img
                className="mask-img"
                srcSet="/img/mobileapp@1x.png 500w, /img/mobileapp@2x.png 1000w"
                alt="e-Potek Mobile Example"
              />
            </div>
          </div> */}
      <div className="ipad marvel-ipad">
        <div className="marvel-device ipad2 black">
          <div className="camera" />
          <div className="screen">
            <img
              className="mask-img"
              srcSet="/img/tabletapp@1x.png 800w, /img/tabletapp@2x.png 2000w"
              alt="e-Potek Tablet Example"
            />
          </div>
          <div className="home" />
        </div>
        {/* <div className="mask">
          <img
            className="mask-img"
            srcSet="/img/tabletapp@1x.png 800w, /img/tabletapp@2x.png 2000w"
            alt="e-Potek Tablet Example"
          />
        </div> */}
      </div>
    </div>
  </div>
);

Devices.propTypes = {};

export default Devices;
