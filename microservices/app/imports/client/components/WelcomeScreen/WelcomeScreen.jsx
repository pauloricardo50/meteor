// @flow
import React from 'react';

import T from 'core/components/Translation';
import Checkbox from 'core/components/Checkbox';
import Waves from 'core/components/Waves';
import WelcomeScreenContainer from './WelcomeScreenContainer';
import WelcomeScreenLinks from './WelcomeScreenLinks';
import WelcomeScreenTop from './WelcomeScreenTop';

type WelcomeScreenProps = {};

const WelcomeScreen = ({
  handleClick,
  setDontShowAgain,
  dontShowAgain,
  handleContact,
}: WelcomeScreenProps) => (
  <div className="welcome-screen animated fadeIn">
    <Waves noSlope={false} />
    <div className="welcome-screen-content">
      <WelcomeScreenTop handleClick={handleClick} />

      <WelcomeScreenLinks handleContact={handleContact} />
      {/*
      <Checkbox
        value={dontShowAgain}
        onChange={() => setDontShowAgain(!dontShowAgain)}
        label={<T id="WelcomeScreen.dontShowAgain" />}
        className="checkbox"
      /> */}
    </div>
  </div>
);

export default WelcomeScreenContainer(WelcomeScreen);
