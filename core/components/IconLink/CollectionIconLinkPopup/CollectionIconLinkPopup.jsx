//
import React, { Component } from 'react';

import Loading from '../../Loading';
import StickyPopover from '../../StickyPopover';
import queries from './queries';
import { titles, components } from './CollectionIconLinkPopupComponents';

export default class CollectionIconLinkPopup extends Component {
  constructor(props) {
    super(props);
    this.state = { data: null };
  }

  loadData = () => {
    const { collection, _id } = this.props;
    const query = queries[collection];

    query(_id, (err, data) => this.setState({ data }));
  };

  getPopoverContent = () => {
    const { data } = this.state;
    const { collection, additionalPopoverContent } = this.props;

    if (data === undefined) {
      return <i>Cette chose a du être supprimée !</i>;
    }

    if (!data) {
      return <Loading small />;
    }

    const CollectionComponent = components[collection];

    return (
      <CollectionComponent {...data}>
        {additionalPopoverContent}
      </CollectionComponent>
    );
  };

  getPopoverTitle = () => {
    const { data } = this.state;
    const { collection } = this.props;

    if (!data) {
      return null;
    }

    const CollectionTitle = titles[collection];

    return <CollectionTitle {...data} />;
  };

  render() {
    const {
      children,
      forceOpen,
      placement,
      data: overrideData,
      replacementPopup,
    } = this.props;
    const { data = overrideData } = this.state;

    return (
      <StickyPopover
        component={replacementPopup || this.getPopoverContent()}
        title={this.getPopoverTitle()}
        onMouseEnter={!data && !replacementPopup ? this.loadData : null}
        delay={data ? 0 : 200}
        forceOpen={forceOpen}
        placement={placement}
      >
        {children}
      </StickyPopover>
    );
  }
}
