import React, { PropTypes } from 'react';
import classNames from 'classnames';

import RequestStepper from '/imports/ui/components/general/RequestStepper.jsx';

import ProjectPieChart from '/imports/ui/components/charts/ProjectPieChart.jsx';
import ExpensesChart from '/imports/ui/components/charts/ExpensesChart.jsx';

import IconButton from 'material-ui/IconButton';
import ArrowDown from 'material-ui/svg-icons/navigation/arrow-drop-down-circle';

const DashboardItem = props => {
  const classes = classNames({
    'mask1 dashboard-item': true,
    inactive: props.multiple && !props.active,
  });

  return (
    <article className={classes}>
      <div className="top">
        <h2>{props.loanRequest.property.address1 || 'Votre projet'}</h2>
        {props.multiple &&
          <div className="right">
            <IconButton onClick={props.handleClick}>
              <ArrowDown color="#d8d8d8" hoverColor="#a8a8a8" />
            </IconButton>
          </div>}
      </div>

      <div className="stepper">
        <RequestStepper loanRequest={props.loanRequest} />
      </div>

      {(!props.multiple || props.active) &&
        <div className="active-div">
          <div className="charts">
            <div className="col-xs-12 col-md-6">
              <ProjectPieChart
                loanRequest={props.loanRequest}
                borrowers={props.borrowers}
              />
            </div>
            <div className="col-xs-12 col-md-6">
              <ExpensesChart
                loanRequest={props.loanRequest}
                borrowers={props.borrowers}
              />
            </div>
          </div>
        </div>}

    </article>
  );
};

DashboardItem.defaultProps = {
  multiple: false,
  active: false,
};

DashboardItem.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  multiple: PropTypes.bool,
  active: PropTypes.bool,
  handleClick: PropTypes.func.isRequired,
};

export default DashboardItem;
