import React from 'react';

import HomeNav from '/imports/ui/components/general/HomeNav.jsx';
import Header from '/imports/ui/components/general/Header.jsx';
import Footer from '/imports/ui/components/general/Footer.jsx';
import ProductDescription from '/imports/ui/components/general/ProductDescription.jsx';
import ProductComparison from '/imports/ui/components/general/ProductComparison.jsx';
import ProductSecurity from '/imports/ui/components/general/ProductSecurity.jsx';


export default class HomePage extends React.Component {
  render() {
    return (
      <main>
        <HomeNav currentUser={this.props.currentUser} />
        <Header />
        <ProductDescription />
        <ProductComparison />
        <ProductSecurity />
        <Footer />
      </main>
    );
  }
}
