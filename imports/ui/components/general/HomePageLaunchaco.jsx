import React from 'react';
import { Link } from 'react-router-dom';
import HomeDev from '/imports/ui/components/general/HomeDev.jsx';

import RaisedButton from 'material-ui/RaisedButton';

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
    // padding: '40px',
    height: 50,
    display: 'inline-block',
  },
};

module.exports = () => (
  <template name="launchaco" style={{ display: 'unset' }}>
    <header className="header">
      <div className="container-sml text-center">
        <div className="col-12">
          <h1 className="heading animated fadeInDown">
            <span>La meilleure hypothèque</span>
            <hr />
            <span>Tout simplement</span>
          </h1>

        </div>
      </div>
      <div className="container-lrg flex">
        <div className="col-6 centervertical animated fadeInLeft">
          <h2 className="desc">
            Mettez votre prêt hypothécaire aux enchères.
          </h2>
          <div className="ctas">
            {/* <RaisedButton
              label="Prenez le test"
              style={styles.style}
              buttonStyle={styles.button}
              labelStyle={styles.label}
              overlayStyle={styles.button}
              containerElement={<Link to="/start1/test" />}
              id="test"
            /> */}
            <RaisedButton
              label="Faire une acquisition"
              containerElement={<Link to="/start1/acquisition" />}
              style={styles.style}
              buttonStyle={styles.button}
              labelStyle={styles.label}
              overlayStyle={styles.button}
              id="acquisitionButton"
            />
            <HomeDev
              style={styles.style}
              buttonStyle={styles.button}
              labelStyle={styles.label}
              overlayStyle={styles.button}
              id="refinancing"
            />
          </div>
        </div>
        <div className="col-6 sidedevices animated fadeInRight">
          {/* <div className="computeriphone">
            <div className="computer">
              <div className="mask">
                <img className="mask-img" src="/img/webapp.svg" />
              </div>
            </div>
            <div className="iphone">
              <div className="mask">
                <img className="mask-img" src="/img/mobileapp.svg" />
              </div>
            </div>
          </div> */}
          <div className="iphoneipad">
            <div className="iphone">
              <div className="mask">
                <img className="mask-img" src="/img/mobileapp.svg" />
              </div>
            </div>
            <div className="ipad">
              <div className="mask">
                <img className="mask-img" src="/img/tabletapp.svg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <div className="feature3 animated fadeInUp">
      <div className="container-lrg flex">
        <div className="col-12">
          <b className="emoji">
            <span className="fa fa-calculator" />
          </b>
          <h3 className="subheading">
            1. Testez votre éligibilité
          </h3>
          <p className="paragraph">
            Identifiez le montant que vous pouvez emprunter en quelques clics.
          </p>
        </div>
        <div className="col-12">
          <b className="emoji">
            <span className="fa fa-gavel" />
          </b>
          <h3 className="subheading">
            2. Organisez les enchères
          </h3>
          <p className="paragraph">
            Obtenez de manière anonyme des offres sur mesure de la part des prêteurs du marché.
          </p>
        </div>
        <div className="col-12">
          <b className="emoji">
            <span className="fa fa-laptop" />
          </b>
          <h3 className="subheading">
            3. Communiquez avec votre prêteur
          </h3>
          <p className="paragraph">
            La plateforme simple et sécurisée vous permet de communiquer facilement avec votre prêteur.
          </p>
        </div>
        <div className="col-12">
          <b className="emoji">
            <span className="fa fa-check" />
          </b>
          <h3 className="subheading">
            4. Obtenez votre prêt
          </h3>
          <p className="paragraph">
            Vous êtes accompagnés dans vos décisions stratégiques par des spécialistes en financement jusqu'à l'obtention de votre prêt.
          </p>
        </div>
      </div>
    </div>
    {/* <div className="feature1">
      <div className="container-sml">
        <div className="col-12 text-center">
          <h3 className="heading">
            Avancez sur votre projet à tout instant
          </h3>
          <p className="paragraph">
            Optimisé pour tablette, smartphone et ordinateur, avancez dans votre demande de prêt où que vous soyez, avec un confort maximal.
          </p>
        </div>
      </div>
      <div className="container-lrg centerdevices col-12">
        <div className="browseriphone">
          <div className="iphone">
            <div className="mask">
              <img className="mask-img" src="/img/mobileapp.svg" />
            </div>
          </div>
          <div className="browser animated fadeInRight">
            <div className="mask">
              <img className="mask-img" src="/img/webapp.svg" />
            </div>
          </div>
        </div>
      </div>
    </div> */}
    <div className="feature2">
      <div className="container-lrg flex">
        <div className="col-6">
          <b className="emoji">
            <span className="fa fa-money" />
          </b>
          <h3 className="subheading">
            Sans engagement et entièrement gratuit
          </h3>
          <p className="paragraph">
            Avancez à votre rythme, arrêtez quand vous voulez, tout ça en toute gratuité, pour toujours.
          </p>
        </div>
        <div className="col-6">
          <b className="emoji">
            <span className="fa fa-lock" />
          </b>
          <h3 className="subheading">
            En toute sécurité
          </h3>
          <p className="paragraph">
            Vos données sont en sûreté, et vous maintenez une confidentialité maximale auprès de tous les établissements financiers.
          </p>
        </div>
      </div>
    </div>
    {/* <div className="socialproof">
      <div className="container-sml">
        <div className="flex text-center">
          <div className="col-12">
            <h4 className="subheading">
              "Une idée géniale, qui révolutionne le prêt hypothécaire"
            </h4>
            <p className="paragraph">
              Doris Leuthard - CEO @ Switzerland
            </p>
          </div>
        </div>
      </div>
    </div> */}
    <div className="footer">
      <div className="content">
        <div className="container-lrg center">
          <div className="col-7">
            <h5 className="heading">
              <span>La meilleure hypothèque</span>
              <hr />
              <span>Tout simplement</span>
            </h5>
          </div>
          <div className="col-5">
            <div className="ctas text-right">
              {/* <RaisedButton
                label="Prenez le test"
                style={styles.style}
                buttonStyle={styles.button}
                labelStyle={styles.label}
                overlayStyle={styles.button}
                containerElement={<Link to="/start1/test" />}
              /> */}
              <RaisedButton
                label="Faire une acquisition"
                containerElement={<Link to="/start1/acquisition" />}
                style={styles.style}
                buttonStyle={styles.button}
                labelStyle={styles.label}
                overlayStyle={styles.button}
              />
              <HomeDev
                style={styles.style}
                buttonStyle={styles.button}
                labelStyle={styles.label}
                overlayStyle={styles.button}
              />
            </div>
          </div>
        </div>
        <div className="container-sml footer-nav text-center">
          <div className="col-12">
            <div>
              <Link className="nav-link" to="/about">
                A Propos
              </Link>
              <a
                className="nav-link"
                href="mailto:contact@e-potek.ch?subject=J'adore%20e-Potek!"
              >
                Contact
              </a>
              <Link className="nav-link" to="/careers">
                Carrières
              </Link>
              <Link className="nav-link" to="/tos">
                Conditions
              </Link>
            </div>
            <br />
            <div>
              <span>
                © 2016-2017 e-Potek
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
);
