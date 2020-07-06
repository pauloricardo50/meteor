import './PageNavigation.scss';

import React from 'react';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { Link } from 'react-scroll';

import useMedia from 'core/hooks/useMedia';

const PageNavigation = ({ fields }) => {
  const isMobile = useMedia({ maxWidth: 768 });

  return (
    <nav className="page-navigation container">
      <Tabs centered orientation={isMobile ? 'vertical' : 'horizontal'}>
        {fields.map((field, idx) => (
          <Tab
            key={idx}
            component={Link}
            label={field.link_text}
            to={field.section_link}
            spy
            smooth
            ignoreCancelEvents={false}
          />
        ))}
      </Tabs>
    </nav>
  );
};

export default PageNavigation;
