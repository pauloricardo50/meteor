import React from 'react';

const WwwPage = ({ pageContext }) => (
  <div>
    <h1>{pageContext.slug}</h1>
    <p>Hello from WwwPage</p>
  </div>
);
export default WwwPage;
