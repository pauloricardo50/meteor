import { withState, compose, withProps } from 'recompose';

export default compose(
  withState('searchQuery', 'setSearchQuery', ''),
  withState('searchResults', 'setSearchResults', []),
  withState('showResults', 'setShowResults', false),
  withState('enableBlur', 'setEnableBlur', true),
  withProps(({
    setSearchQuery,
    setSearchResults,
    query,
    resultsFilter,
    setShowResults,
    searchResults,
    enableBlur,
  }) => ({
    onSearch: (event) => {
      event.preventDefault();
      setSearchQuery(event.target.value);
      query
        .clone({ searchQuery: event.target.value })
        .fetch((err, results) => {
          if (err) {
            throw err;
          }

          setSearchResults(resultsFilter ? resultsFilter(results) : results);
          setShowResults(!!searchResults.length);
        });
    },
    onBlur: () => {
      if (enableBlur) {
        setShowResults(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    },
    onFocus: () => setShowResults(!!searchResults.length),
  })),
);
