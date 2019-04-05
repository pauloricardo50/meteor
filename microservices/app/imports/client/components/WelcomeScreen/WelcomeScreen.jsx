// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';

import T from 'core/components/Translation';
import Button from 'core/components/Button';
import Icon from 'core/components/Icon';
import Checkbox from 'core/components/Checkbox';
import WelcomeScreenContainer from './WelcomeScreenContainer';

type WelcomeScreenProps = {};

const WelcomeScreen = ({
  handleClick,
  setDontShowAgain,
  dontShowAgain,
  handleContact,
}: WelcomeScreenProps) => (
  <div className="welcome-screen animated fadeIn">
    <div className="welcome-screen-content">
      <img
        src="/img/logo_square_black.svg"
        alt="e-Potek"
        className="logo-welcome"
      />
      <h1 className="text-center">
        <T id="WelcomeScreen.title" />
      </h1>

      <p className="description">
        <T id="WelcomeScreen.description" />
      </p>

      <div className="item">
        <h3>
          <T id="WelcomeScreen.whoWeAre" />
        </h3>
        <Button
          primary
          icon={<Icon type="openInNew" />}
          iconAfter
          component="a"
          href={`${Meteor.settings.public.subdomains.www}/about`}
          target="_blank"
        >
          <T id="WelcomeScreen.readAboutUs" />
        </Button>
      </div>

      <div className="item">
        <h3>
          <T id="WelcomeScreen.faq" />
        </h3>
        <Button
          primary
          icon={<Icon type="openInNew" />}
          iconAfter
          component="a"
          href={`${Meteor.settings.public.subdomains.www}/faq`}
          target="_blank"
        >
          <T id="WelcomeScreen.readFaq" />
        </Button>
      </div>

      <div className="item">
        <h3>
          <T id="WelcomeScreen.help" />
        </h3>
        <Button
          primary
          icon={<Icon type="forum" />}
          iconAfter
          onClick={handleContact}
        >
          <T id="WelcomeScreen.contactUs" />
        </Button>
      </div>

      <div className="item">
        <h3>
          <T id="WelcomeScreen.other" />
        </h3>
        <Button
          primary
          icon={<Icon type="openInNew" />}
          iconAfter
          component="a"
          href={`${Meteor.settings.public.subdomains.www}/interests`}
          target="_blank"
        >
          <T id="WelcomeScreen.interestRates" />
        </Button>
        <Button
          primary
          icon={<Icon type="download" />}
          iconAfter
          component="a"
          href={`${Meteor.settings.public.subdomains.app}/files/e-Potek SA.pdf`}
          target="_blank"
        >
          <T id="WelcomeScreen.companyDescription" />
        </Button>
      </div>

      <Checkbox
        value={dontShowAgain}
        onChange={() => setDontShowAgain(!dontShowAgain)}
        label={<T id="WelcomeScreen.dontShowAgain" />}
        className="checkbox"
      />
      <Button
        raised
        secondary
        onClick={handleClick}
        className="welcome-screen-cta"
      >
        <T id="general.continue" />
      </Button>
    </div>
  </div>
);

export default WelcomeScreenContainer(WelcomeScreen);
