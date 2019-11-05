import React, { Component } from 'react';
import PropTypes from 'prop-types';
import JsSearch from 'js-search';
import { injectIntl } from 'react-intl';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import T from 'core/components/Translation';
import { generalTooltips } from 'core/arrays/tooltips';
import Button from 'core/components/Button';

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

    this.tooltips = this.getTooltips();
    this.search.addDocuments(this.tooltips);
  };

  getTooltips = () => {
    const f = this.props.intl.formatMessage;
    const intlValues = { verticalSpace: ' ' };

    return Object.keys(generalTooltips).map((match) => {
      const tooltipId = generalTooltips[match].id;
      const tooltip = {
        id: tooltipId,
        tooltipMatch: match,
        tooltipValue1: f({ id: `tooltip.${tooltipId}` }, intlValues),
      };
      if (generalTooltips[match].double) {
        tooltip.tooltipValue2 = f({ id: `tooltip2.${tooltipId}` }, intlValues);
      }

      return tooltip;
    });
  };

  render() {
    const { search } = this.props;
    const { showId } = this.state;
    const results = this.search.search(search);

    if (showId) {
      const selectedResult = this.tooltips.filter((result) => result.id === showId)[0];
      return (
        <div className="flex-col" style={styles.selected}>
          <h3>{selectedResult.tooltipMatch}</h3>
          <p>{selectedResult.tooltipValue1}</p>
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

    if (search === '') {
      return (
        <List style={styles.list}>
          {this.tooltips.map((result) => (
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

    if (search && results.length === 0) {
      return (
        <div className="description">
          <p>
            <T id="SearchResults.none" />
          </p>
        </div>
      );
    }

    return (
      <List style={styles.list}>
        {results.map((result) => (
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
  intl: PropTypes.object.isRequired,
  search: PropTypes.string.isRequired,
};

export default injectIntl(SearchResults);
