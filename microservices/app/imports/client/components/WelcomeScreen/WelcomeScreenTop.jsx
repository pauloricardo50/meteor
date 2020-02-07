import { Meteor } from 'meteor/meteor';

import React from 'react';

import T from 'core/components/Translation';
import Button from 'core/components/Button';
import Checkbox from 'core/components/Checkbox';

const WelcomeScreenTop = ({
  handleClick,
  setDontShowAgain,
  dontShowAgain,
  displayCheckbox = true,
  buttonProps,
  cta,
  img,
}) => (
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

      <div className="welcome-screen-ctas">
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
        {!Meteor.userId() && (
          <Button
            primary
            className="welcome-screen-cta"
            link
            to={`/login?path=${
              window.location.href.split(window.location.origin)[1]
            }`}
          >
            <T id="general.login" />
          </Button>
        )}
      </div>
    </div>

    {!img && (
      <div className="welcome-screen-top-img">
        <img src="/img/homepage-closing-big.svg" alt="e-Potek" />
      </div>
    )}
    {img && (
      <div
        className="welcome-screen-top-img-override"
        style={{ backgroundImage: `url("${img}")` }}
      />
    )}
  </div>
);

export default WelcomeScreenTop;
