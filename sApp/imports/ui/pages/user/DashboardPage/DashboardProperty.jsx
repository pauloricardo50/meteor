import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import track from '/imports/js/helpers/analytics';
import { T } from 'core/components/Translation';
import Icon from '/imports/ui/components/general/Icon';
import { getPropertyCompletion } from '/imports/js/helpers/requestFunctions';
import DashboardItem from './DashboardItem';

const DashboardProperty = (props) => {
  const percent = getPropertyCompletion(props.loanRequest, props.borrowers);

  return (
    <DashboardItem
      className="dashboard-list"
      title={
        <T
          id="DashboardProperty.title"
          values={{ count: props.borrowers.length }}
        />
      }
    >
      <Link
        to={`/app/requests/${props.loanRequest._id}/property`}
        className="link"
        onClick={() => track('clicked dashboard property', {})}
      >
        <Icon
          type={
            props.loanRequest.property.style === 'villa' ? 'home' : 'building'
          }
          style={{ marginRight: 16, width: 64, height: 64 }}
          className="icon"
        />
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
            <T id="PropertyPage.progress" values={{ value: percent }} />{' '}
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
