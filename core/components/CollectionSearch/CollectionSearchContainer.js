import { compose, withProps, withStateHandlers } from 'recompose';

const setResults = ({
  setState,
  searchResults,
  newSearchQuery,
  resultsFilter,
  results,
}) => {
  setState({
    searchResults: {
      ...searchResults,
      [newSearchQuery]: resultsFilter ? resultsFilter(results) : results,
    },
  });
};

export default compose(
  withStateHandlers(
    { searchQuery: '', searchResults: {}, showResults: false },
    { setState: () => newState => newState },
  ),
  withProps(
    ({
      query,
      queryParams,
      resultsFilter,
      searchResults,
      searchQuery,
      setState,
      method,
      methodParams,
    }) => ({
      onSearch: event => {
        event.preventDefault();
        const newSearchQuery = event.target.value;
        setState({ searchQuery: newSearchQuery });
        setState({ showResults: true });
        if (query) {
          query
            .clone({ searchQuery: newSearchQuery, ...queryParams })
            .fetch((err, results) => {
              if (err) {
                throw err;
              }

              setResults({
                setState,
                searchResults,
                newSearchQuery,
                resultsFilter,
                results,
              });
            });
        } else if (method) {
          method
            .run(methodParams({ searchQuery: newSearchQuery }))
            .then(results =>
              setResults({
                setState,
                searchResults,
                newSearchQuery,
                resultsFilter,
                results: Array.isArray(results)
                  ? results
                  : results
                  ? [results]
                  : undefined,
              }),
            );
        }
      },
      hideResults: () => {
        setState({ showResults: false });
      },
      onFocus: () => {
        setState({ showResults: !!searchQuery });
      },
    }),
  ),
);
