import React from 'react';
import { Link } from 'gatsby';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { linkResolver } from '../../utils/linkResolver';
import './PageLinks.scss';

const PageLinks = ({ fields }) => (
  <nav className="page-links container">
    <Tabs centered>
      {fields.map((field, idx) => (
        <Tab
          key={idx}
          component={Link}
          label={field.label}
          to={linkResolver(field.link._meta)}
        />
      ))}
    </Tabs>
  </nav>
);

export default PageLinks;
