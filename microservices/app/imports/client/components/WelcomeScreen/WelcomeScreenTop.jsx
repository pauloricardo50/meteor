// @flow
import React from 'react';

import T from 'core/components/Translation';
import Button from 'core/components/Button';
import Checkbox from 'core/components/Checkbox';

type WelcomeScreenTopProps = {};

const WelcomeScreenTop = ({
  handleClick,
  setDontShowAgain,
  dontShowAgain,
  displayCheckbox = true,
  buttonProps,
  cta,
}: WelcomeScreenTopProps) => (
  <div className="card1 welcome-screen-top">
    <div className="welcome-screen-top-text">
      <h1 className="text-center">
        <T id="WelcomeScreen.title" />
      </h1>

      <p className="description">
        <T id="WelcomeScreen.description" />
      </p>

      {displayCheckbox && (
        <Checkbox
          value={dontShowAgain}
          onChange={() => setDontShowAgain(!dontShowAgain)}
          label={<T id="WelcomeScreen.dontShowAgain" />}
          className="checkbox"
        />
      )}

      {cta || (
        <Button
          raised
          secondary
          onClick={handleClick}
          className="welcome-screen-cta"
          {...buttonProps}
        >
          <T id="general.begin" />
        </Button>
      )}
    </div>

    <div className="welcome-screen-top-img">
      <img src="/img/homepage-closing-big.svg" alt="e-Potek" />
    </div>
  </div>
);

export default WelcomeScreenTop;
