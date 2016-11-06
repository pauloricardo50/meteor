import React, { Component, PropTypes } from 'react';

import Header from '/imports/ui/components/general/Header.jsx';
import ProductDescription from '/imports/ui/components/general/ProductDescription.jsx';
import NewUserOptions from '/imports/ui/components/general/NewUserOptions.jsx';
import HomeFooter from '/imports/ui/components/general/HomeFooter.jsx';

const styles = {
  spacing: {
    paddingTop: 200,
  },
};

export default class HomePage extends Component {
  componentDidMount() {
    DocHead.setTitle('e-Potek');
  }

  render() {
    return (
      <div>
        <Header />
        <ProductDescription />
        <div className="col-xs-8 col-xs-offset-2" style={styles.spacing} id="start">
          <NewUserOptions />
        </div>
        <HomeFooter />
      </div>
    );
  }
}
