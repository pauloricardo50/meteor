import React, { Component } from 'react';

import Button from 'core/components/Button';
import Icon from 'core/components/Icon';

import MotionCarousel from './MotionCarousel';

const NEXT = 'NEXT';
const reviews = [
  {
    name: 'Yannis',
    text:
      "En tant que CEO d'e-Potek, je peux vous assurer que vous êtes en présence d'un très bon produit. Comment ça j'ai pas le droit de donner une review?",
  },
  {
    name: 'Florian',
    text:
      "Bon, j'ai développé tout le site web, regardez ces effets d'animation sur cette superbe carte blanche, des journées de boulot! Rien que pour ça, e-Potek en vaut la peine.",
  },
  {
    name: 'Cyril',
    text:
      "Certes, j'ai investi dans cette boite, donc le conflit d'intérêt dans cette review est assez fort, mais je pense que vous devriez vraiment leur donner une chance. Regardez-les, ils sont désespérés avec leurs reviews..",
  },
];

export default class HomePageReviewsCarousel extends Component {
  constructor(props) {
    super(props);

    this.state = { currentIndex: 0 };
  }

  handleClick = (buttonType) => {
    const { currentIndex } = this.state;
    let nextIndex = buttonType === NEXT ? currentIndex + 1 : currentIndex - 1;

    nextIndex = nextIndex >= 0 ? nextIndex : reviews.length - 1;
    nextIndex = nextIndex >= reviews.length ? 0 : nextIndex;

    this.setState({ currentIndex: nextIndex });
  };

  render() {
    const { currentIndex } = this.state;
    return (
      <div className="home-page-reviews-carousel">
        <Button onClick={this.handleClick} variant="fab" color="primary">
          <Icon type="left" />
        </Button>
        <MotionCarousel reviews={reviews} currentIndex={currentIndex} />
        <Button
          onClick={() => this.handleClick(NEXT)}
          variant="fab"
          color="primary"
        >
          <Icon type="right" />
        </Button>
      </div>
    );
  }
}
