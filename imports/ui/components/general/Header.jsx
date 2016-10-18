import React from 'react';
import { Meteor } from 'meteor/meteor';

import AccountsModalContainer from '../accounts/AccountsModalContainer.jsx';

export default class Header extends React.Component {

  constructor() {
    super();

    this.state = {
      image1: 2,
      image2: 0,
      image3: 1,
    };
  }

  componentDidMount() {
    let backgrounds = [];
    if (screen.width < 1400) {
      backgrounds = ('url(/img/appartement.jpg)', 'url(/img/mer.jpg)', 'url(/img/alpes.jpg)');
    } else {
      backgrounds = ('url(/img/appartement@2x.jpg)', 'url(/img/mer@2x.jpg)', 'url(/img/alpes@2x.jpg)');
    }

    // this.bgImageInterval = Meteor.setInterval(() => {
    //   this.setState({
    //     image1: (this.state.image1 + 1) % 3,
    //     image2: (this.state.image2 + 1) % 3,
    //     image3: (this.state.image3 + 1) % 3,
    //   });
    //   this.nextBackground();
    // }, 1000);

    // document.getElementsByClassName('.header-image-0').css('background-image', backgrounds[0]);
  }

  componentWillUnmount() {
    // clearInterval(this.bgImageInterval);
  }

  nextBackground() {

    // $('.header-image-' + image2).css('z-index', '1'); // Prepare next image to appear
    // $('.header-image-' + image1).addClass('animated fadeOut'); // Make current image fade out
    //
    // if (image2 === 0 || image2 === 2) {
    //   $('#titleText').animate({
    //     color: '#FFF'
    //   }, 1000);
    // } else {
    //   $('#titleText').animate({
    //     color: '#000'
    //   }, 1000);
    // }
    //
    // $('.header-image-' + image3).css('z-index', '0'); // Add last image at bottom of stack
    // $('.header-image-' + image3).removeClass('animated fadeOut'); // Remove last image's animation
    // setTimeout(function() {
    //   $('.header-image-' + image2).css('z-index', '2'); // Put the now appeared image at top of stack
    // }, 2000);
  }

  render() {
    return (
      <header className="home-header">
        {/* <AccountsModalContainer /> */}
          <div className="text-vertical-center">
            <h3>La façon la plus simple d'obtenir la meilleure hypothèque.</h3>
            <br />
            <a href="/start" className="btn btn-primary" type="button">Commencer</a>
          </div>
      </header>
    );
  }
}

// <header>
//   <div className="header" id="top">
//     <div className="text-vertical-center">
//       <h3 id="titleText">Votre Propriété Financée - Simplement.</h3>
//       <br />
//       <a href="/start" className="btn btn-success" type="button" id="home-button">Commencer</a>
//     </div>
//   </div>
//   <div className="header-image-0" style={style1} />
//   <div className="header-image-1" style={style2} />
//   <div className="header-image-2 animated fade-out" style={style3} />
// </header>
