import React from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';



import '/imports/ui/components/blaze/startForm.js';


export default class StartPage extends React.Component {
  render() {
    return (
      <section id="start-main">
        <div className="start-form">
          <Blaze template="startForm" />
        </div>
      </section>
    );
  }
}
