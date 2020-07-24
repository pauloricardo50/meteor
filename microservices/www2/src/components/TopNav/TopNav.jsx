import './TopNav.scss';

import React, { useContext, useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useWindowScroll from 'react-use/lib/useWindowScroll';

import colors from 'core/config/colors';

import { EPOTEK_APP } from '../../constants';
import LanguageContext from '../../contexts/LanguageContext';
import { getLanguageData } from '../../utils/languages';
import { trackCTA } from '../../utils/tracking';
import Button from '../Button';
import { useLayoutContext } from '../Layout/LayoutContext';
import LoginMenu from '../LoginMenu';
import MainMenu from '../MainMenu';
import TopMenu from '../TopMenu';
import TopNavLogo from './TopNavLogo';

const useStyles = makeStyles(() => ({
  root: {
    flexDirection: 'row',
    boxShadow: 'unset',
    borderBottom: `1px solid ${colors.borderGreyLight}`,
  },
}));

const contentHeight = 400;

const TopNav = () => {
  const { tracking_id: pageTrackingId } = useLayoutContext();
  const [language] = useContext(LanguageContext);
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('md'), {
    noSsr: true, // Otherwise it always returns false at first: https://github.com/mui-org/material-ui/issues/21142
  });
  const { y } = useWindowScroll();
  const shouldUseDynamicCta = isMobile && pageTrackingId === 'Home page';
  const [showCta, setShowCta] = useState(shouldUseDynamicCta ? y === 0 : true);

  useEffect(() => {
    if (shouldUseDynamicCta && !showCta && y > contentHeight) {
      setShowCta(true);
    } else if (shouldUseDynamicCta && showCta && y < contentHeight) {
      setShowCta(false);
    } else if (!shouldUseDynamicCta && !showCta) {
      setShowCta(true);
    }
  }, [y, shouldUseDynamicCta]);

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={1}
      classes={useStyles()}
      className="top-nav"
    >
      <div className="top-nav-content">
        <div className="top-nav-left">
          <MainMenu />

          {!isMobile && <TopMenu menuName="top-nav" />}
        </div>

        <TopNavLogo />

        <div className="top-nav-right">
          {!isMobile && <LoginMenu />}

          {showCta && (
            <Button
              size={isMobile ? 'small' : 'medium'}
              raised
              primary
              component="a"
              href={EPOTEK_APP}
              onTrack={() =>
                trackCTA({
                  buttonTrackingId: 'Topnav start',
                  toPath: EPOTEK_APP,
                  pageTrackingId,
                })
              }
              className="animated fadeIn"
            >
              {getLanguageData(language).getALoanText}
            </Button>
          )}
        </div>
      </div>
    </AppBar>
  );
};

export default TopNav;
