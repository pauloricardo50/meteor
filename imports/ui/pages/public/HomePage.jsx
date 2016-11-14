import React, { Component } from 'react';
import { DocHead } from 'meteor/kadira:dochead';


import HomeHeader from '/imports/ui/components/general/HomeHeader.jsx';
import HomeProductDescription from '/imports/ui/components/general/HomeProductDescription.jsx';
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
        <HomeHeader />
        <HomeProductDescription />
        <div className="col-sm-8 col-sm-offset-2 col-xs-12" style={styles.spacing} id="start">
          <NewUserOptions />
        </div>
        <HomeFooter />
      </div>
    );
  }
}
