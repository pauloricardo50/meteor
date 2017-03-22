import React, { PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';

export default class PropertyOverview extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <article>
        {this.props.loanRequests.map(request => (
          <div className="mask1">hi!</div>
        ))}
      </article>
    );
  }
}

PropertyOverview.propTypes = {
  loanRequests: PropTypes.arrayOf(PropTypes.any),
};

PropertyOverview.defaultProps = {
  loanRequests: [],
};
