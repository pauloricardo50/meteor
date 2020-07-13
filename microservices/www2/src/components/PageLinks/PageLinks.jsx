import './PageLinks.scss';

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { useLocation } from '@reach/router';
import { Link } from 'gatsby';

import useMedia from 'core/hooks/useMedia';

import { linkResolver } from '../../utils/linkResolver';

const useStyles = isMobile =>
  makeStyles(() => {
    if (isMobile) {
      return {
        tab: {
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',

          '& .MuiTab-wrapper': {
            alignItems: 'flex-start',
            marginLeft: '16px',
          },
        },
      };
    }

    return { tab: {} };
  });

const PageLinks = ({ fields }) => {
  const isMobile = useMedia({ maxWidth: 768 });
  const getClasses = useStyles(isMobile);
  const classes = getClasses();
  const location = useLocation();
  const { pathname } = location;

  let tab = 0;
  fields.some((field, i) => {
    if (pathname.split('/').slice(-1)[0] === field?.link?._meta?.uid) {
      tab = i;
      return true;
    }

    return false;
  });

  return (
    <nav className="page-links container">
      <Tabs
        centered={!isMobile}
        orientation={isMobile ? 'vertical' : 'horizontal'}
        value={tab}
        indicatorColor="primary"
        TabIndicatorProps={
          isMobile ? { style: { left: 0, right: 'unset' } } : {}
        }
      >
        {fields.map((field, idx) => (
          <Tab
            key={idx}
            component={Link}
            label={field.label}
            to={linkResolver(field.link._meta)}
            className={classes.tab}
          />
        ))}
      </Tabs>
    </nav>
  );
};

export default PageLinks;
