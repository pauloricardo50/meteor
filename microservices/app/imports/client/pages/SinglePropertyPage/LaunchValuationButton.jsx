// @flow
import React from 'react';
import { scroller as scroll } from 'react-scroll';
import Button from 'core/components/Button';
import cx from 'classnames';

type LaunchValuationButtonProps = {
  enabled: boolean,
};

const SCROLL_DURATION = 600;
const SCROLL_DELAY = 100;
const VALUATION_MARGIN = 60;
const VALUATION_PADDING = 48;

const scrollToTopAndLaunchValuation = () => {
  const offset = -(VALUATION_MARGIN + VALUATION_PADDING + 16);
  scroll.scrollTo('valuation', {
    duration: SCROLL_DURATION,
    smooth: true,
    delay: SCROLL_DELAY,
    offset,
  });
  setTimeout(
    () => document.querySelector('.valuation-button').click(),
    SCROLL_DURATION + SCROLL_DELAY + 1,
  );
};

const LaunchValuationButton = ({ enabled }: LaunchValuationButtonProps) => (
  <div className="launch-valuation-button">
    <Button
      secondary
      raised
      onClick={scrollToTopAndLaunchValuation}
      label="Lancer l'expertise"
      className={cx('animated fadeIn', { hide: !enabled })}
    />
  </div>
);

export default LaunchValuationButton;
