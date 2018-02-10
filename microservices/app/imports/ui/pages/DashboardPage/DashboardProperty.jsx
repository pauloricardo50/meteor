import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import track from 'core/utils/analytics';
import { T } from 'core/components/Translation';
import Icon from 'core/components/Icon';
import { getPropertyCompletion } from 'core/utils/loanFunctions';
import DashboardItem from './DashboardItem';
import withLoan from 'core/containers/withLoan';
import { PROPERTY_STYLE } from 'core/api/constants';

const DashboardProperty = (props) => {
  const percent = getPropertyCompletion(props);

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
        to={`/loans/${props.loan._id}/property`}
        className="link"
        onClick={() => track('clicked dashboard property', {})}
      >
        <Icon
          type={
            props.property.style === PROPERTY_STYLE.VILLA ? 'home' : 'building'
          }
          style={{ marginRight: 16, width: 64, height: 64 }}
          className="icon"
        />
        {/* <span className="fa fa-user-circle-o fa-4x" style={{ marginRight: 16 }} /> */}
        <div className="text">
          <h4 className="fixed-size no-margin" style={{ marginBottom: 8 }}>
            {props.loan.name}
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
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  property: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default withLoan(DashboardProperty);
