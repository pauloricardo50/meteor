import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Masonry from 'react-masonry-component';

import DashboardRecap from './DashboardRecap';
import DashboardCharts from './DashboardCharts';
import DashboardBorrowers from './DashboardBorrowers';
import DashboardLastSteps from './DashboardLastSteps';
import DashboardPayments from './DashboardPayments';
import DashboardDownload from './DashboardDownload';
import DashboardOffer from './DashboardOffer';
import DashboardProperty from './DashboardProperty';
import DashboardStatus from './DashboardStatus';

const getGrid = ({ loanRequest }) => {
  const done = loanRequest.status === 'done';

  return [
    {
      component: DashboardLastSteps,
      show: !done && loanRequest.logic.step === 3,
    },
    { component: DashboardStatus, show: !done },
    { component: DashboardPayments, show: done },
    { component: DashboardRecap, show: true },
    { component: DashboardCharts, show: true },
    { component: DashboardBorrowers, show: true },
    { component: DashboardProperty, show: true },
    { component: DashboardDownload, show: loanRequest.files.contract },
    {
      component: DashboardOffer,
      show: loanRequest.logic.lender && loanRequest.logic.lender.offerId,
    },
  ];
};

export default class DashboardContent extends Component {
  reloadMasonry = () => this.masonry.layout();

  render() {
    const masonryOptions = {
      transitionDuration: '0s', // Anything else, makes it run horribly in safari
      stagger: 0,
      columnWidth: '.grid-sizer',
      itemSelector: '.grid-item',
      gutter: 16,
      horizontalOrder: false,
    };

    return (
      <div>
        <Masonry
          className={'grid'}
          elementType={'div'}
          options={masonryOptions}
          disableImagesLoaded={false}
          updateOnEachImageLoad={false}
          ref={(c) => {
            this.masonry = this.masonry || c.masonry;
          }}
        >
          <div className="grid-sizer" />
          {getGrid(this.props)
            .filter(component => component.show)
            .map((c, i) =>
              (<c.component
                {...this.props}
                reloadMasonry={this.reloadMasonry}
                key={i}
              />),
            )}
        </Masonry>
      </div>
    );
  }
}

DashboardContent.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  currentUser: PropTypes.objectOf(PropTypes.any).isRequired,
};
