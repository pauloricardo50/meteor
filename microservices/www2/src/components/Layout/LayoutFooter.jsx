import React from 'react';

const LayoutFooter = props => (
  <footer>
    © {new Date().getFullYear()}, Built with
    {` `}
    <a href="https://www.gatsbyjs.org">Gatsby</a>
  </footer>
);

export default LayoutFooter;
