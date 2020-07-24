import React, { PureComponent } from 'react';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import FinancingLabels from '../FinancingLabels';
import { makeRenderDetail } from './financingSectionHelpers';

export default class FinancingSectionDetails extends PureComponent {
  constructor(props) {
    super(props);
    const { detailConfig, sectionItemProps } = props;
    this.renderDetail = makeRenderDetail(detailConfig, sectionItemProps);
  }

  render() {
    const { detailConfig, sectionProps } = this.props;
    const { structures } = sectionProps;

    return (
      <AccordionDetails className="section-detail">
        <FinancingLabels config={detailConfig} />

        {structures.map(structure =>
          this.renderDetail(structure, sectionProps),
        )}
      </AccordionDetails>
    );
  }
}
