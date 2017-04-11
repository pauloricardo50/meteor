import React, { PropTypes } from 'react';
import classNames from 'classnames';

import RequestStepper from '/imports/ui/components/general/RequestStepper.jsx';

import ProjectPieChart from '/imports/ui/components/charts/ProjectPieChart.jsx';
import ExpensesChart from '/imports/ui/components/charts/ExpensesChart.jsx';
import MetricsTriple from '/imports/ui/components/general/MetricsTriple.jsx';
import Recap from '/imports/ui/components/general/Recap';

import IconButton from 'material-ui/IconButton';
import ArrowDown from 'material-ui/svg-icons/navigation/arrow-drop-down-circle';

import OverviewItems from './OverviewItems.jsx';

const DashboardItem = props => {
  const classes = classNames({
    'mask1 dashboard-item': true,
    inactive: props.multiple && !props.active,
  });

  return (
    <article className={classes}>
      <div className="top">
        <h2>{props.loanRequest.name || 'Projet Sans Titre'}</h2>
        {props.multiple &&
          <div className="right">
            <IconButton onClick={props.handleClick}>
              <ArrowDown color="#d8d8d8" hoverColor="#a8a8a8" />
            </IconButton>
          </div>}
      </div>

      <OverviewItems
        borrowers={props.borrowers}
        loanRequest={props.loanRequest}
      />

      <div className="stepper">
        <RequestStepper
          loanRequest={props.loanRequest}
          borrowers={props.borrowers}
        />
      </div>

      <hr style={{ width: '50%', margin: '80px auto' }} />

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

      <MetricsTriple
        loanRequest={props.loanRequest}
        borrowers={props.borrowers}
      />

      <h2 className="text-center">Plan Financier</h2>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Recap
          loanRequest={props.loanRequest}
          borrowers={props.borrowers}
          arrayName="dashboard"
        />
      </div>

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
