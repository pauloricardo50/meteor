import React from 'react';

import Footer from '/imports/ui/components/general/Footer.jsx';
import ProductDescription from '/imports/ui/components/general/ProductDescription.jsx';


const HomeLayout = ({ content }) => (
  <main className="homelayout">
    <div className="header" />
    <ProductDescription />
    <Footer />
  </main>
);

export default HomeLayout;
