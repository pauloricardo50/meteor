import React, { Component } from 'react';

import Fab from '@material-ui/core/Fab';
import Icon from 'core/components/Icon';

import MotionCarousel from './MotionCarousel';
import reviews from './reviews';

const NEXT = 'NEXT';

const shuffleArray = array => array.sort(() => 0.5 - Math.random());
const shuffledReviews = shuffleArray(reviews);

export default class HomePageReviewsCarousel extends Component {
  constructor(props) {
    super(props);

    this.state = { currentIndex: 0 };
  }

  handleClick = buttonType => {
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
        <Fab onClick={this.handleClick} color="primary">
          <Icon type="left" />
        </Fab>
        <MotionCarousel reviews={shuffledReviews} currentIndex={currentIndex} />
        <Fab onClick={() => this.handleClick(NEXT)} color="primary">
          <Icon type="right" />
        </Fab>
      </div>
    );
  }
}
