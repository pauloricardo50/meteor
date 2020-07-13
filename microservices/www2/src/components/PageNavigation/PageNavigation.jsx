import './PageNavigation.scss';

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { Link } from 'react-scroll';

import useMedia from 'core/hooks/useMedia';

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

const PageNavigation = ({ fields }) => {
  const isMobile = useMedia({ maxWidth: 768 });
  const getClasses = useStyles(isMobile);
  const classes = getClasses();
  const [tab, setTab] = useState(0);

  return (
    <nav className="page-navigation container">
      <Tabs
        centered={!isMobile}
        orientation={isMobile ? 'vertical' : 'horizontal'}
        value={tab}
        onChange={(e, v) => setTab(v)}
        indicatorColor="primary"
        TabIndicatorProps={
          isMobile ? { style: { left: 0, right: 'unset' } } : {}
        }
      >
        {fields.map((field, idx) => (
          <Tab
            key={idx}
            component={Link}
            label={field.link_text}
            to={field.section_link}
            spy
            smooth
            ignoreCancelEvents={false}
            className={classes.tab}
          />
        ))}
      </Tabs>
    </nav>
  );
};

export default PageNavigation;
