// @flow
import React from 'react';

import Waves from 'core/components/Waves';
import WelcomeScreenContainer from './WelcomeScreenContainer';
import WelcomeScreenLinks from './WelcomeScreenLinks';
import WelcomeScreenTop from './WelcomeScreenTop';

type WelcomeScreenProps = {};

export const WelcomeScreen = ({
  handleClick,
  setDontShowAgain,
  dontShowAgain,
  handleContact,
  displayCheckbox,
  buttonProps,
  cta,
}: WelcomeScreenProps) => (
  <div className="welcome-screen animated fadeIn">
    <Waves noSlope={false} />
    <div className="welcome-screen-content">
      <WelcomeScreenTop
        handleClick={handleClick}
        setDontShowAgain={setDontShowAgain}
        dontShowAgain={dontShowAgain}
        displayCheckbox={displayCheckbox}
        buttonProps={buttonProps}
        cta={cta}
      />

      <WelcomeScreenLinks handleContact={handleContact} />
    </div>
  </div>
);

export default WelcomeScreenContainer(WelcomeScreen);
