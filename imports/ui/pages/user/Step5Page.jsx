import React, {PropTypes} from 'react';
import { DocHead } from 'meteor/kadira:dochead';

export default class Step5Page extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    DocHead.setTitle('Étape 5 - e-Potek');
  }

  render() {
    return (<div>Step 5</div>);
  }
}

Step5Page.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
