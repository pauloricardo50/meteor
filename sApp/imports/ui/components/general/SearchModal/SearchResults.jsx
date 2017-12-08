import React, { Component } from 'react';
import PropTypes from 'prop-types';
import JsSearch from 'js-search';
import { injectIntl } from 'react-intl';

import List, { ListItem, ListItemText } from 'material-ui/List';

import { T } from '/imports/ui/components/general/Translation';
import { generalTooltips } from '/imports/js/arrays/tooltips';
import Button from '/imports/ui/components/general/Button';

const styles = {
  list: {
    width: '100%',
    maxWidth: 800,
  },
  selected: {
    width: '100%',
    maxWidth: 800,
  },
};

class SearchResults extends Component {
  constructor(props) {
    super(props);

    this.state = { showId: '' };
    this.setupSearch();
  }

  componentWillReceiveProps(nextProps) {
    // Cancel viewing results if something new is typed/deleted
    if (nextProps.search !== this.props.search && this.state.showId) {
      this.setState({ showId: '' });
    }
  }

  setupSearch = () => {
    this.search = new JsSearch.Search('id');
    this.search.addIndex('tooltipMatch');
    this.search.addIndex('tooltipValue1');
    this.search.addIndex('tooltipValue2');
    this.search.addDocuments(this.getTooltips());
  };

  getTooltips = () => {
    const f = this.props.intl.formatMessage;
    const intlValues = {
      verticalSpace: ' ',
    };

    return Object.keys(generalTooltips).map((match) => {
      const tooltipId = generalTooltips[match];
      const tooltip = {
        id: tooltipId,
        tooltipMatch: match,
        tooltipValue1: f({ id: `tooltip.${tooltipId}` }, intlValues),
      };
      if (typeof generalTooltips[match] !== 'string') {
        tooltip.tooltipValue2 = f({ id: `tooltip2.${tooltipId}` }, intlValues);
      }

      return tooltip;
    });
  };

  render() {
    const { search } = this.props;
    const { showId } = this.state;
    const results = this.search.search(search);

    if (search && results.length === 0) {
      return (
        <div className="description">
          <p>
            <T id="SearchResults.none" />
          </p>
        </div>
      );
    }

    if (showId) {
      const selectedResult = results.filter(result => result.id === showId)[0];
      return (
        <div className="flex-col" style={styles.selected}>
          <h3>{selectedResult.tooltipMatch}</h3>
          <p>{selectedResult.tooltipValue1}</p>
          <br />
          <p>{selectedResult.tooltipValue2}</p>
          <div className="text-center" style={{ paddingTop: 16 }}>
            <Button
              primary
              label={<T id="general.ok" />}
              onClick={() => this.setState({ showId: '' })}
            />
          </div>
        </div>
      );
    }

    return (
      <List style={styles.list}>
        {results.slice(0, 5).map(result => (
          <ListItem
            button
            divider
            onClick={() => this.setState({ showId: result.id })}
            key={result.id}
          >
            <ListItemText
              primary={result.tooltipMatch}
              secondary={result.tooltipValue1}
            />
          </ListItem>
        ))}
      </List>
    );
  }
}

SearchResults.propTypes = {
  search: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(SearchResults);
