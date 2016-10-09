import React from 'react';

import Header from '/imports/ui/components/general/Header.jsx';
import Footer from '/imports/ui/components/general/Footer.jsx';
import ProductDescription from '/imports/ui/components/general/ProductDescription.jsx';


export default class HomePage extends React.Component {
  render() {
    return (
      <main>
        <Header />
        <ProductDescription />
        <Footer />
      </main>
    );
  }
}
