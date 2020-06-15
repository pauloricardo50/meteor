import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Link } from 'react-scroll';
import './PageNavigation.scss';

const PageNavigation = ({ fields }) => (
  <nav className="page-navigation container">
    <Tabs centered>
      {fields.map((field, idx) => (
        <Tab
          key={idx}
          component={Link}
          label={field.link_text}
          to={field.section_link}
          spy={true}
          smooth={true}
          ignoreCancelEvents={false}
        />
      ))}
    </Tabs>
  </nav>
);

export default PageNavigation;
