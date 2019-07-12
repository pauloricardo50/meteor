import { compose, withProps, withStateHandlers } from 'recompose';

export default compose(
  withStateHandlers(
    { searchQuery: '', searchResults: {}, showResults: false },
    { setState: () => newState => newState },
  ),
  withProps(({
    query,
    queryParams,
    resultsFilter,
    searchResults,
    searchQuery,
    setState,
  }) => ({
    onSearch: (event) => {
      event.preventDefault();
      const newSearchQuery = event.target.value;
      setState({ searchQuery: newSearchQuery });
      setState({ showResults: true });
      query
        .clone({ searchQuery: newSearchQuery, ...queryParams })
        .fetch((err, results) => {
          if (err) {
            throw err;
          }

          setState({
            searchResults: {
              ...searchResults,
              [newSearchQuery]: resultsFilter
                ? resultsFilter(results)
                : results,
            },
          });
        });
    },
    hideResults: () => {
      setState({ showResults: false });
    },
    onFocus: () => {
      setState({ showResults: !!searchQuery });
    },
  })),
);
