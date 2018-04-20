import React, { Component } from 'react';

import Button from 'core/components/Button';
import Icon from 'core/components/Icon';

import MotionCarousel from './MotionCarousel';
import reviews from './reviews';

const NEXT = 'NEXT';

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
