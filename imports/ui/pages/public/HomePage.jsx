import React, { Component } from 'react';
import { DocHead } from 'meteor/kadira:dochead';
import { Link } from 'react-router-dom';
import HomeDev from '/imports/ui/components/general/HomeDev.jsx';
import track from '/imports/js/helpers/analytics';
import { T } from '/imports/ui/components/general/Translation.jsx';

import Button from '/imports/ui/components/general/Button.jsx';

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

export default class HomePage extends Component {
  componentDidMount() {
    DocHead.setTitle('e-Potek');
  }

  render() {
    return (
      <div style={{ display: 'unset !important' }}>
        <div name="launchaco" style={{ display: 'unset' }}>
          <header className="header">
            <div className="container-sml text-center">
              <div className="col-12">
                <h1 className="heading animated fadeInDown">
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
                    onTouchTap={() =>
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
                    onTouchTap={() =>
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
                        src="/img/mobileapp.svg"
                        alt="e-Potek Mobile Example"
                      />
                    </div>
                  </div>
                  <div className="ipad">
                    <div className="mask">
                      <img
                        className="mask-img"
                        src="/img/tabletapp.svg"
                        alt="e-Potek Tablet Example"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div className="feature3 animated fadeInUp">
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
          </div>
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
          <div className="footer">
            <div className="content">
              <div className="container-lrg center">
                <div className="col-7">
                  <h5 className="heading">
                    <T id="HomePage.tagline1" />
                    <hr />
                    <T id="HomePage.tagline2" />
                  </h5>
                </div>
                <div className="col-5">
                  <div className="ctas text-right">
                    <Button
                      raised
                      label={<T id="HomePage.compare" />}
                      containerElement={<Link to="/app/compare" />}
                      style={styles.style}
                      buttonStyle={styles.button}
                      labelStyle={styles.label}
                      overlayStyle={styles.button}
                      onTouchTap={() =>
                        track('Funnel - clicked home page CTA', {
                          title: 'compare',
                          at: 'bottom',
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
                      onTouchTap={() =>
                        track('Funnel - clicked home page CTA', {
                          title: 'acquisition',
                          at: 'bottom',
                        })}
                    />
                    <HomeDev
                      style={styles.style}
                      buttonStyle={styles.button}
                      labelStyle={styles.label}
                      overlayStyle={styles.button}
                      handleClick={() =>
                        track('Funnel - clicked home page CTA', {
                          title: 'refinancing',
                          at: 'bottom',
                        })}
                    />
                  </div>
                </div>
              </div>
              <div className="container-sml footer-nav text-center">
                <div className="col-12">
                  <div>
                    <Link className="nav-link" to="/about">
                      <T id="HomePage.footer.about" />
                    </Link>
                    <a
                      className="nav-link"
                      href="mailto:contact@e-potek.ch?subject=I%20Love%20e-Potek!"
                    >
                      <T id="HomePage.footer.contact" />
                    </a>
                    <Link className="nav-link" to="/careers">
                      <T id="HomePage.footer.careers" />
                    </Link>
                    <Link className="nav-link" to="/tos">
                      <T id="HomePage.footer.conditions" />
                    </Link>
                  </div>
                  <br />
                  <div>
                    <span>© 2016-2017 e-Potek</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
