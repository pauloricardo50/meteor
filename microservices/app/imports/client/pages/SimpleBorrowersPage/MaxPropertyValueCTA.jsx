// @flow
import React from 'react';
import { scroller as scroll } from 'react-scroll';

import Calculator from 'core/utils/Calculator';
import Button from 'core/components/Button';

type MaxPropertyValueCTAProps = {
  loan: Object,
  isMobile: boolean,
  hasEnoughHeight: boolean,
};

const SCROLL_DURATION = 600;
const SCROLL_DELAY = 100;
const MAX_PROPERTY_VALUE_PADDING = 32;

const displayButton = (loan, isMobile, hasEnoughHeight) => {
  const { borrowers = [], maxPropertyValue: { borrowerHash } = {} } = loan;
  const canCalculateSolvency = Calculator.canCalculateSolvency({ borrowers });
  const hash = Calculator.getBorrowerFormHash({ loan });
  const shouldRecalculate = borrowerHash != hash;

  if (isMobile || hasEnoughHeight) {
    return false;
  }

  return canCalculateSolvency && shouldRecalculate;
};

const scrollToTop = () => {
  const offset = -(2 * MAX_PROPERTY_VALUE_PADDING + 16);
  scroll.scrollTo('max-property-value-element', {
    duration: SCROLL_DURATION,
    smooth: true,
    delay: SCROLL_DELAY,
    offset,
  });
  setTimeout(
    () =>
      document
        .querySelector('.max-property-value-element')
        .classList.add('animated', 'pulse'),
    SCROLL_DURATION + SCROLL_DELAY + 10,
  );
};

const MaxPropertyValueCTA = ({
  loan,
  isMobile,
  hasEnoughHeight,
}: MaxPropertyValueCTAProps) =>
  (displayButton(loan, isMobile, hasEnoughHeight) ? (
    <Button
      onClick={scrollToTop}
      secondary
      raised
      className="max-property-value-cta animated fadeInRightBig"
    >
      Calculez votre capacité d'achat
    </Button>
  ) : null);

export default MaxPropertyValueCTA;
