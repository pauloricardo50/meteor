import './PageLinks.scss';

import React from 'react';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { Link } from 'gatsby';

import useMedia from 'core/hooks/useMedia';

import { linkResolver } from '../../utils/linkResolver';

const PageLinks = ({ fields }) => {
  const isMobile = useMedia({ maxWidth: 768 });

  return (
    <nav className="page-links container">
      <Tabs centered orientation={isMobile ? 'vertical' : 'horizontal'}>
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
};

export default PageLinks;
