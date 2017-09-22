import React from 'react';
import { Link } from 'react-router-dom';
import Scroll from 'react-scroll';

import track from '/imports/js/helpers/analytics';
import HomeDev from '/imports/ui/components/general/HomeDev';
import { T } from '/imports/ui/components/general/Translation';
import Button from '/imports/ui/components/general/Button';
import IconButton from '/imports/ui/components/general/IconButton';

const styles = {
  style: {
    height: 50,
    marginRight: 8,
    marginTop: 8,
  },
  button: {
    height: 50,
  },
  label: {
    fontSize: '1.2em',
    height: 50,
    display: 'inline-block',
  },
};

const Header = props => (
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
        {/* <h2 className="desc">
          <T id="HomePage.description" description="Description above the CTAs" />
        </h2> */}
        <div className="ctas">
          <Button
            raised
            label={<T id="HomePage.compare" />}
            containerElement={<Link to="/app/compare" />}
            style={styles.style}
            buttonStyle={styles.button}
            labelStyle={styles.label}
            overlayStyle={styles.button}
            id="compareButton"
            onClick={() =>
              track('Funnel - clicked home page CTA', {
                title: 'compare',
                at: 'top',
              })}
          />
          <Button
            raised
            label={<T id="HomePage.CTA1" />}
            containerElement={<Link to="/start1/acquisition" />}
            style={styles.style}
            buttonStyle={styles.button}
            labelStyle={styles.label}
            overlayStyle={styles.button}
            id="acquisitionButton"
            onClick={() =>
              track('Funnel - clicked home page CTA', {
                title: 'acquisition',
                at: 'top',
              })}
          />
          <HomeDev
            style={styles.style}
            buttonStyle={styles.button}
            labelStyle={styles.label}
            overlayStyle={styles.button}
            id="refinancing"
            handleClick={() =>
              track('Funnel - clicked home page CTA', {
                title: 'refinancing',
                at: 'top',
              })}
          />
        </div>
      </div>
      <div className="col-6 sidedevices animated fadeInRight">
        <div className="iphoneipad">
          <div className="iphone">
            <div className="mask">
              <img
                className="mask-img"
                srcSet="/img/mobileapp@1x.png 500w, /img/mobileapp@2x.png 1000w"
                alt="e-Potek Mobile Example"
              />
            </div>
          </div>
          <div className="ipad">
            <div className="mask">
              <img
                className="mask-img"
                srcSet="/img/tabletapp@1x.png 800w, /img/tabletapp@2x.png 2000w"
                alt="e-Potek Tablet Example"
              />
            </div>
          </div>
        </div>
      </div>
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
