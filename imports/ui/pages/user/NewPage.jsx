import PropTypes from 'prop-types';
import React from 'react';

import NewUserOptions from '/imports/ui/components/general/NewUserOptions.jsx';

const NewPage = props => {
  if (props.loanRequests.length > 0) {
    props.history.push(`/app/requests/${props.loanRequests[0]._id}`);
  }

  return <section><NewUserOptions /></section>;
};

NewPage.propTypes = {
  loanRequests: PropTypes.arrayOf(PropTypes.object).isRequired,
};

NewPage.defaultProps = {
  loanRequests: [],
};

export default NewPage;
