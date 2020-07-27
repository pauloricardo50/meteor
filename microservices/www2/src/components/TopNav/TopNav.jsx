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
  // These 2 media queries return false at first, since in SSR they can't detect
  // screen size. To avoid any jumps in content, I make sure they're both
  // initialized before deciding what to do
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('md'));
  const isLarge = useMediaQuery(theme => theme.breakpoints.up('md'));
  const isTrueMobile = isMobile && !isLarge;
  const isTrueLarge = isLarge && !isMobile;
  const { y } = useWindowScroll();
  const shouldUseDynamicCta = isTrueMobile && pageTrackingId === 'Home page';
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

          {isTrueLarge && <TopMenu menuName="top-nav" />}
        </div>

        <TopNavLogo />

        <div className="top-nav-right">
          {isTrueLarge && <LoginMenu />}

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
