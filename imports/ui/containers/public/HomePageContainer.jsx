import { composeWithTracker } from 'react-komposer';

import HomePage from '/imports/ui/pages/public/HomePage.jsx';

function composer(props, onData) {
  // if (Meteor.subscribe('posts').ready()) {
  //   const posts = Posts.find({}, { sort: { _id: 1 } }).fetch();
  //   onData(null, { posts });
  // }
  onData(null, { props });
}

export default composeWithTracker(composer)(HomePage);
