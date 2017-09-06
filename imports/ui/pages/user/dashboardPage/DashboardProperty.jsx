import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import BuildingIcon from 'material-ui/svg-icons/communication/business';
import HomeIcon from 'material-ui/svg-icons/action/home';

import track from '/imports/js/helpers/analytics';
import { T } from '/imports/ui/components/general/Translation.jsx';
import { getPropertyCompletion } from '/imports/js/helpers/requestFunctions';
import DashboardItem from './DashboardItem.jsx';

const DashboardProperty = props => {
  const Icon = props.loanRequest.property.style === 'villa' ? HomeIcon : BuildingIcon;
  const percent = getPropertyCompletion(props.loanRequest, props.borrowers);

  return (
    <DashboardItem
      className="dashboard-list"
      title={<T id="DashboardProperty.title" values={{ count: props.borrowers.length }} />}
    >
      <Link
        to={`/app/requests/${props.loanRequest._id}/property`}
        className="link"
        onClick={() => track('clicked dashboard property', {})}
      >
        <Icon style={{ marginRight: 16, width: 64, height: 64 }} className="icon" />
        {/* <span className="fa fa-user-circle-o fa-4x" style={{ marginRight: 16 }} /> */}
        <div className="text">
          <h4 className="fixed-size no-margin" style={{ marginBottom: 8 }}>
            {props.loanRequest.name}
          </h4>
          <h4
            className={classnames({
              'fixed-size no-margin': true,
              secondary: percent < 1,
              success: percent >= 1,
            })}
          >
            <T id="PropertyPage.progress" values={{ value: percent }} />
            {' '}
            {percent >= 1 && <span className="fa fa-check" />}
          </h4>
        </div>
      </Link>
    </DashboardItem>
  );
};

DashboardProperty.propTypes = {
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default DashboardProperty;
