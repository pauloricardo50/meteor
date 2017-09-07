import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Masonry from 'react-masonry-component';

import DashboardRecap from './DashboardRecap.jsx';
import DashboardCharts from './DashboardCharts.jsx';
import DashboardBorrowers from './DashboardBorrowers.jsx';
import DashboardLastSteps from './DashboardLastSteps.jsx';
import DashboardPayments from './DashboardPayments.jsx';
import DashboardDownload from './DashboardDownload.jsx';
import DashboardOffer from './DashboardOffer.jsx';
import DashboardProperty from './DashboardProperty.jsx';
import DashboardStatus from './DashboardStatus.jsx';

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
