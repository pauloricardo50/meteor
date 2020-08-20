import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import cx from 'classnames';

import BlueTheme from 'core/components/Themes/BlueTheme';
import TopNavLogo from 'core/components/TopNav/TopNavLogo';

import { useOnboarding } from './OnboardingContext';
import OnboardingStepper from './OnboardingStepper';

const SideNav = ({ fixed }) => (
  <BlueTheme>
    <div
      className={cx('onboarding-side-nav', {
        fixed,
        'animated fadeInLeft': fixed,
      })}
    >
      <div className="onboarding-side-nav-header">
        <TopNavLogo light />
        <span className="epotek font-size-3 ml-8 mr-16">e-Potek</span>
      </div>

      <OnboardingStepper />
    </div>
  </BlueTheme>
);

const OnboardingSideNav = () => {
  const { isMobile, showDrawer, setShowDrawer } = useOnboarding();

  if (isMobile) {
    return (
      <Drawer open={showDrawer} onClose={() => setShowDrawer(false)}>
        <SideNav />
      </Drawer>
    );
  }

  return <SideNav fixed />;
};

export default OnboardingSideNav;
