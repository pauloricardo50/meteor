// @flow
import React, { Component } from 'react';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Popover from 'react-bootstrap/lib/Popover';

import Loading from '../../Loading';
import queries from './queries';
import { titles, components } from './CollectionIconLinkPopupComponents';

type CollectionIconLinkPopupProps = {
  _id: string,
  children: any,
  collection: string,
};
type CollectionIconLinkPopupState = {
  data?: Object,
};

export default class CollectionIconLinkPopup extends Component<
  CollectionIconLinkPopupProps,
  CollectionIconLinkPopupState,
> {
  constructor(props) {
    super(props);
    this.state = { data: null };
  }

  loadData = () => {
    const { collection, _id } = this.props;
    const query = queries[collection];

    query(_id, (err, data) => {
      this.setState({ data });
    });
  };

  getPopoverContent = () => {
    const { data } = this.state;
    const { collection } = this.props;

    if (!data) {
      return <Loading small />;
    }

    const CollectionComponent = components[collection];

    return <CollectionComponent {...data} />;
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
    const { children } = this.props;
    const { data } = this.state;

    return (
      <OverlayTrigger
        overlay={(
          <Popover title={this.getPopoverTitle()}>
            {this.getPopoverContent()}
          </Popover>
        )}
        onEnter={() => this.loadData()}
        delay={data ? 0 : 200}
      >
        {children}
      </OverlayTrigger>
    );
  }
}
