import React from 'react';

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


{/* <RaisedButton
  label="Testez votre éligibilité"
  href="/start"
  style={styles.style}
  buttonStyle={styles.button}
  labelStyle={styles.label}
  overlayStyle={styles.button}
/>
<RaisedButton
  label="Se Connecter"
  href="/login"
  style={styles.style}
  buttonStyle={styles.button}
  labelStyle={styles.label}
  overlayStyle={styles.button}
  primary
/> */}


module.exports = function(props) {
  return (

  // <!-- <head>
  //   <title>
  //     Launchaco - Name a Business.
  //   </title>
  //   <meta charSet="utf-8">
  //   <meta name="viewport" content="width=device-width,initial-scale=1">
  //   <link rel="stylesheet" type="text/css" href="css/main.css">
  //   <link rel="stylesheet" type="text/css" href="css/devices.css">
  // </head> -->
  <template name="launchaco" style={{ display: 'unset' }}>
    <header className="header">
      {/* <!-- <div className="container-lrg">
        <div className="col-12 spread">
          <div>
            <a className="logo">
              &nbsp;e-Potek<br>
            </a>
          </div>
          <div>
            <a className="nav-link" href="#">
              Twitter
            </a>
            <a className="nav-link" href="#">
              Facebook
            </a>
          </div>
        </div>
      </div> --> */}
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
          <h2 className="description">
            Mettez votre prêt hypothécaire aux enchères.
          </h2>
          <div className="ctas">
            {/* <a className="ctas-button" href="/start">
              Testez votre Éligibilité
            </a>
            <a className="ctas-button-2" href="/login">
              Se Connecter
            </a> */}
            <RaisedButton
              label="Testez votre éligibilité"
              href="/start"
              style={styles.style}
              buttonStyle={styles.button}
              labelStyle={styles.label}
              overlayStyle={styles.button}
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
    <div className="feature1">
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
    </div>
    <div className="feature2">
      <div className="container-lrg flex">
        <div className="col-6">
          <b className="emoji">
            💵
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
            🔒
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
    <div className="socialproof">
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
    </div>
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
              {/* <a className="ctas-button" href="/start">
                Testez votre Éligibilité
              </a>
              <a className="ctas-button-2" href="/login">
                Se Connecter
              </a> */}
              <RaisedButton
                label="Testez votre éligibilité"
                href="/start"
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
              <a className="nav-link">
                A Propos
              </a>
              <a className="nav-link">
                Contact
              </a>
              <a className="nav-link">
                Carrières
              </a>
              <a className="nav-link">
                Conditions
              </a>
              {/* <a className="nav-link">
                TOS
              </a>
              <a className="nav-link">
                Privacy
              </a> */}
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
};
