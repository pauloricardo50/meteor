import React, {PropTypes} from 'react';

import FortuneSliders from '/imports/ui/components/general/FortuneSliders.jsx';
import FortuneSliders2 from '/imports/ui/components/general/FortuneSliders2.jsx';

export default class DemoPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <FortuneSliders />
        <FortuneSliders2 />
      </div>
    );
  }
}

DemoPage.propTypes = {
};
