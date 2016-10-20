import React from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';


import HomeNav from '/imports/ui/components/general/HomeNav.jsx';

import '/imports/ui/components/blaze/startForm.js';


export default class StartPage extends React.Component {
  render() {
    return (
      <main id="start-main">
        <HomeNav />
        <div className="start-form">
          <Blaze template="startForm" />
        </div>
      </main>
    );
  }
}
